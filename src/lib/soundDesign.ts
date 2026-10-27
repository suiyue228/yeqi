/** Original local interaction sounds. Licensed background music is in musicTrack.ts. */
export const WIND_CHIME_COOLDOWN_MS = 1400;
export const STAR_SWING_MS = 1800;
export const STAR_BELL_ROOM = { cutoff: 4400, wet: 0.08 } as const;
export type VoiceKind = "music" | "effect";
export interface Voice {
  source: AudioScheduledSourceNode;
  gain: GainNode;
  kind: VoiceKind;
}
export type TrackVoice = (voice: Voice) => () => void;
interface Tone {
  frequency: number;
  time: number;
  duration: number;
  peak: number;
  attack?: number;
  pan?: number;
  detune?: number;
}

// One shared deterministic stereo impulse per context. A softened, diffuse tail
// supplies distance without feedback loops, external recordings or large assets.
const impulses = new WeakMap<BaseAudioContext, AudioBuffer>();
function roomImpulse(context: BaseAudioContext) {
  const cached = impulses.get(context);
  if (cached) return cached;
  const buffer = context.createBuffer(
    2,
    Math.ceil(context.sampleRate * 4.2),
    context.sampleRate,
  );
  for (let channel = 0; channel < 2; channel++) {
    const samples = buffer.getChannelData(channel);
    let seed = 173 + channel * 1024,
      smooth = 0;
    for (let i = 0; i < samples.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      smooth += (seed / 2147483648 - 1 - smooth) * 0.16;
      const t = i / context.sampleRate;
      const onset = Math.min(1, Math.max(0, (t - 0.045) / 0.09));
      samples[i] = smooth * onset * Math.exp(-t * 1.7);
    }
  }
  impulses.set(context, buffer);
  return buffer;
}

export function createRoom(
  context: BaseAudioContext,
  output: AudioNode,
  cutoff: number,
  wetLevel: number,
) {
  const input = context.createGain(),
    filter = context.createBiquadFilter();
  const dry = context.createGain(),
    wet = context.createGain();
  let reverb = context.createConvolver();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = 0.4;
  dry.gain.value = 0.85;
  wet.gain.value = wetLevel;
  input.connect(filter);
  filter.connect(dry).connect(output);
  filter.connect(reverb);
  reverb.buffer = roomImpulse(context);
  reverb.connect(wet).connect(output);
  return {
    input,
    reset() {
      // Replacing the convolver flushes its old tail on stop/background/resume.
      filter.disconnect(reverb);
      reverb.disconnect();
      reverb = context.createConvolver();
      reverb.buffer = roomImpulse(context);
      filter.connect(reverb);
      reverb.connect(wet);
    },
  };
}

function tone(
  context: BaseAudioContext,
  destination: AudioNode,
  kind: VoiceKind,
  options: Tone,
  track?: TrackVoice,
) {
  const oscillator = context.createOscillator(),
    gain = context.createGain(),
    pan = context.createStereoPanner();
  const { time, duration, peak, attack = 0.04 } = options;
  oscillator.type = "sine";
  oscillator.frequency.value = options.frequency;
  oscillator.detune.value = options.detune ?? 0;
  pan.pan.value = options.pan ?? 0;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peak, time + attack);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(0.00001, peak * 0.6),
    time + attack + (duration - attack) * 0.2,
  );
  gain.gain.exponentialRampToValueAtTime(0.00001, time + duration);
  gain.gain.linearRampToValueAtTime(0, time + duration + 0.04);
  oscillator.connect(gain).connect(pan).connect(destination);
  const untrack = track?.({ source: oscillator, gain, kind });
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
    pan.disconnect();
    untrack?.();
  };
  oscillator.start(time);
  oscillator.stop(time + duration + 0.06);
}

export type QuietCue =
  | "curtain"
  | "drawer"
  | "letter"
  | "index"
  | "save"
  | "favorite"
  | "delete"
  | "chime";
export function scheduleQuietCue(
  context: BaseAudioContext,
  destination: AudioNode,
  kind: QuietCue,
  time: number,
  track?: TrackVoice,
) {
  const notes: Record<QuietCue, number[]> = {
    curtain: [110, 164.8138],
    drawer: [130.8128, 195.9977],
    letter: [220, 293.6648],
    index: [329.6276],
    save: [220, 293.6648, 329.6276],
    favorite: [293.6648, 440],
    delete: [146.8324, 110],
    chime: [293.6648, 440],
  };
  notes[kind].forEach((frequency, i) =>
    tone(
      context,
      destination,
      "effect",
      {
        frequency,
        time: time + i * 0.19,
        duration: 1.8 + i * 0.15,
        attack: kind === "curtain" || kind === "drawer" ? 0.22 : 0.075,
        peak: 0.065 / (1 + i * 0.55),
        pan: (i % 2 ? 1 : -1) * 0.12,
      },
      track,
    ),
  );
}

export interface ChimeTouch {
  variation?: number;
  strength?: number;
  pan?: number;
}

/** A tiny, firm clapper excites a light bell; one contact, not a melody. */
export function scheduleWindChime(
  context: BaseAudioContext,
  destination: AudioNode,
  time: number,
  track?: TrackVoice,
  touch: ChimeTouch = {},
) {
  const variation = Math.max(
    0,
    Math.min(0.999999, touch.variation ?? Math.random()),
  );
  const rate = context.sampleRate,
    length = Math.ceil(rate * 1.55);
  const raw = new Float32Array(length);
  const hit = new Float32Array(Math.ceil(rate * 0.0006));
  let seed = 1 + Math.floor(variation * 0x7ffffffe);
  for (let i = 0; i < hit.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const clapper = Math.sin((Math.PI * i) / hit.length) ** 2;
    hit[i] = clapper * (1 + (seed / 2147483648 - 1) * 0.035);
  }
  const fundamental = 1280 * (0.994 + variation * 0.012);
  for (const [ratio, weight, decay] of [
    [1, 1, 0.3],
    [2.76, 0.24, 0.1],
    [4.07, 0.045, 0.045],
  ]) {
    const angle = (2 * Math.PI * fundamental * ratio) / rate;
    const radius = Math.exp(-1 / (decay * rate));
    const feedback = 2 * radius * Math.cos(angle),
      damping = radius * radius;
    let previous = 0,
      earlier = 0;
    for (let i = 0; i < length; i++) {
      const sample = feedback * previous - damping * earlier + (hit[i] ?? 0);
      earlier = previous;
      previous = sample;
      raw[i] += sample * weight * Math.sin(angle);
    }
  }
  let peak = 0;
  for (const sample of raw) peak = Math.max(peak, Math.abs(sample));
  const secondary = variation < 0.22;
  const secondDelay = secondary ? 0.25 + variation * 0.5 : 0;
  const secondOffset = Math.round(secondDelay * rate);
  const strength = Math.max(0.4, Math.min(1, touch.strength ?? 0.85));
  const level = (0.105 * strength) / Math.max(peak, 0.000001);
  const buffer = context.createBuffer(1, length, rate),
    output = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const echo =
      secondary && i >= secondOffset ? raw[i - secondOffset] * 0.18 : 0;
    const fade = Math.min(1, (length - i) / (rate * 0.08));
    output[i] = (raw[i] + echo) * level * fade;
  }
  const source = context.createBufferSource(),
    gain = context.createGain(),
    pan = context.createStereoPanner();
  source.buffer = buffer;
  pan.pan.value = Math.max(-0.35, Math.min(0.35, touch.pan ?? 0));
  source.connect(gain).connect(pan).connect(destination);
  const untrack = track?.({ source, gain, kind: "effect" });
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
    pan.disconnect();
    untrack?.();
  };
  source.start(time);
  return {
    strikeCount: secondary ? 2 : 1,
    lastStrike: secondDelay,
    duration: buffer.duration,
  };
}
