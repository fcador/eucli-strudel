import { Track, StrudelFormat } from "../types/sequencer";

function trackToStrudel(track: Track): string {
  return `s("${track.sound}(${track.pulses},${track.steps})")`;
}

function trackToStrudelStruct(track: Track): string {
  const binaryStr = track.pattern.join(" ");
  return `s("${track.sound}").struct("${binaryStr}")`;
}

function formatTracks(
  tracks: Track[],
  formatter: (track: Track) => string
): string {
  if (tracks.length === 0) return "";
  if (tracks.length === 1) return formatter(tracks[0]);
  const patterns = tracks.map(formatter).join(",\n  ");
  return `stack(\n  ${patterns}\n)`;
}

export function tracksToStrudel(
  tracks: Track[],
  format: StrudelFormat
): string {
  const formatter =
    format === "euclidean" ? trackToStrudel : trackToStrudelStruct;
  return formatTracks(tracks, formatter);
}
