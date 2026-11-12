import type { TrackVoice } from "./soundDesign";

export const MUSIC_LEVEL = 0.1;
export const MUSIC_TRACK = {
  title: "Sleep · Piano Only",
  artist: "Scott Buckley",
  url: `${import.meta.env.BASE_URL}audio/sleep-piano-scott-buckley.mp3`,
  source: "https://www.scottbuckley.com.au/library/sleep/",
  license: "https://creativecommons.org/licenses/by/4.0/",
  crossfadeSeconds: 8,
} as const;

let pending: Promise<AudioBuffer> | null = null;

/** Licensed recording, loaded only after explicit audio activation. */
export function loadMusicBuffer(): Promise<AudioBuffer> {
  if (!pending)
    pending = readRecording().catch((error: unknown) => {
      pending = null;
      throw error;
    });
  return pending;
}

async function readRecording() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(MUSIC_TRACK.url, {
      signal: controller.signal,
      cache: "force-cache",
    });
    if (!response.ok) throw new Error("recording unavailable");
    // A 32kHz decoded buffer keeps a complete piano performance within a modest
    // memory budget. It is independent of the live effects AudioContext.
    const decoder = new OfflineAudioContext(2, 1, 32000);
    const recording = await decoder.decodeAudioData(
      await response.arrayBuffer(),
    );
    return prepareMusicLoop(decoder, recording);
  } catch {
    throw new Error(
      "月下钢琴暂时无法读取，请检查连接后重试；仍可静音记录。",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

/** Keep the performance; trim a quiet outer tail and join its ends in PCM. */
export function prepareMusicLoop(
  context: BaseAudioContext,
  recording: AudioBuffer,
) {
  if (recording.duration < 30 || recording.numberOfChannels > 2)
    throw new Error("invalid recording");
  const channels = Array.from({ length: recording.numberOfChannels }, (_, i) =>
    recording.getChannelData(i),
  );
  let energy = 0,
    peak = 0;
  for (const samples of channels)
    for (const sample of samples) {
      if (!Number.isFinite(sample)) throw new Error("invalid samples");
      energy += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }
  const rms = Math.sqrt(energy / (recording.length * channels.length));
  if (rms < 0.00001) throw new Error("silent recording");
  const windowSize = Math.round(recording.sampleRate * 0.1);
  const threshold = Math.max(0.0002, rms * 0.08);
  let first = -1,
    last = recording.length;
  for (let at = 0; at < recording.length; at += windowSize) {
    let sum = 0,
      count = 0;
    for (const samples of channels)
      for (let i = at; i < Math.min(at + windowSize, samples.length); i++) {
        sum += samples[i] ** 2;
        count++;
      }
    if (Math.sqrt(sum / count) > threshold) {
      if (first < 0) first = at;
      last = Math.min(recording.length, at + windowSize);
    }
  }
  const margin = Math.round(recording.sampleRate * 0.6);
  first = Math.max(0, first - margin);
  last = Math.min(recording.length, last + margin);
  const overlap = Math.round(
    MUSIC_TRACK.crossfadeSeconds * recording.sampleRate,
  );
  const length = last - first - overlap;
  if (length < overlap * 2) throw new Error("recording too short");
  const result = context.createBuffer(
    channels.length,
    length,
    recording.sampleRate,
  );
  const gain = Math.min(0.065 / rms, 0.72 / peak);
  const bodyLength = length - overlap;
  channels.forEach((samples, channel) => {
    const output = result.getChannelData(channel);
    for (let i = 0; i < bodyLength; i++)
      output[i] = samples[first + overlap + i] * gain;
    // The final overlap ends at head[overlap], adjoining body[0] on wrap.
    for (let i = 0; i < overlap; i++) {
      const angle = ((i / overlap) * Math.PI) / 2;
      output[bodyLength + i] =
        gain *
        (samples[last - overlap + i] * Math.cos(angle) +
          samples[first + i] * Math.sin(angle));
    }
  });
  return result;
}

export function startMusic(
  context: BaseAudioContext,
  destination: AudioNode,
  buffer: AudioBuffer,
  time: number,
  offset: number,
  track: TrackVoice,
) {
  const source = context.createBufferSource(),
    gain = context.createGain();
  source.buffer = buffer;
  source.loop = true;
  gain.gain.setValueAtTime(0, time);
  gain.gain.setValueCurveAtTime(
    new Float32Array([0, 0.067, 0.25, 0.5, 0.75, 0.933, 1]),
    time,
    3,
  );
  source.connect(gain).connect(destination);
  const untrack = track({ source, gain, kind: "music" });
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
    untrack();
  };
  source.start(time, offset % buffer.duration);
}
