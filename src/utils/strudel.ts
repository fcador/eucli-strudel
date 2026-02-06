import { Track } from "../types/sequencer";

export function trackToStrudel(track: Track): string {
  return `s("${track.sound}(${track.pulses},${track.steps})")`;
}

export function tracksToStrudel(tracks: Track[]): string {
  if (tracks.length === 0) return "";
  if (tracks.length === 1) return trackToStrudel(tracks[0]);

  const patterns = tracks.map(trackToStrudel).join(",\n  ");
  return `stack(\n  ${patterns}\n)`;
}
