/** Original local interaction sounds. Licensed background music is in musicTrack.ts. */
export const WIND_CHIME_COOLDOWN_MS = 1800;
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

export function scheduleWindChime(
  context: BaseAudioContext,
  destination: AudioNode,
  time: number,
  track?: TrackVoice,
) {
  // Two uneven pairs: ding-ling ... ding-ling. Inharmonic upper modes give a
  // hollow metal/glass ring; the second pair is quieter and farther away.
  const strikes = [
    { delay: 0, frequency: 587.3295, level: 0.16, pan: -0.3 },
    { delay: 0.26, frequency: 783.9909, level: 0.12, pan: 0.25 },
    { delay: 0.83, frequency: 659.2551, level: 0.095, pan: 0.16 },
    { delay: 1.12, frequency: 880, level: 0.068, pan: -0.2 },
  ];
  strikes.forEach((s) => {
    for (const [ratio, strength, duration] of [
      [1, 1, 3.6],
      [2.756, 0.16, 1.7],
      [4.07, 0.035, 0.8],
    ]) {
      tone(
        context,
        destination,
        "effect",
        {
          frequency: s.frequency * ratio,
          time: time + s.delay,
          duration,
          peak: s.level * strength,
          attack: 0.008 + (ratio > 1 ? 0.004 : 0),
          pan: s.pan,
        },
        track,
      );
    }
  });
}
