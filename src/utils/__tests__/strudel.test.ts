import { tracksToStrudel } from "../strudel";
import { Track } from "../../types/sequencer";
import { generateEuclideanPattern } from "../euclidean";

const makeTrack = (overrides: Partial<Track> = {}): Track => ({
  id: "test",
  label: "Test",
  sound: "bd",
  asset: 1,
  steps: 16,
  pulses: 4,
  rotation: 0,
  pattern: generateEuclideanPattern(16, 4),
  volume: 0.7,
  ...overrides,
});

describe("tracksToStrudel", () => {
  it("returns empty string for no tracks", () => {
    expect(tracksToStrudel([], "euclidean")).toBe("");
  });

  it("single track euclidean format without rotation", () => {
    const track = makeTrack({ sound: "bd", pulses: 4, steps: 16 });
    expect(tracksToStrudel([track], "euclidean")).toBe('s("bd(4,16)")');
  });

  it("single track euclidean format with rotation", () => {
    const track = makeTrack({ sound: "bd", pulses: 4, steps: 16, rotation: 2 });
    expect(tracksToStrudel([track], "euclidean")).toBe('s("bd(4,16,2)")');
  });

  it("single track struct format", () => {
    const track = makeTrack({
      sound: "bd",
      steps: 8,
      pulses: 3,
      rotation: 0,
      pattern: generateEuclideanPattern(8, 3),
    });
    expect(tracksToStrudel([track], "struct")).toBe(
      's("bd").struct("1 0 0 1 0 0 1 0")'
    );
  });

  it("struct format applies rotation", () => {
    const track = makeTrack({
      sound: "bd",
      steps: 4,
      pulses: 1,
      rotation: 1,
      pattern: generateEuclideanPattern(4, 1),
    });
    expect(tracksToStrudel([track], "struct")).toBe(
      's("bd").struct("0 0 0 1")'
    );
  });

  it("multiple tracks euclidean format wraps in stack()", () => {
    const tracks = [
      makeTrack({ id: "k", sound: "bd", pulses: 4, steps: 16 }),
      makeTrack({ id: "s", sound: "sd", pulses: 2, steps: 16 }),
    ];
    const result = tracksToStrudel(tracks, "euclidean");
    expect(result).toContain("stack(");
    expect(result).toContain('s("bd(4,16)")');
    expect(result).toContain('s("sd(2,16)")');
  });

  it("multiple tracks struct format wraps in stack()", () => {
    const tracks = [
      makeTrack({
        id: "k",
        sound: "bd",
        steps: 4,
        pulses: 2,
        pattern: generateEuclideanPattern(4, 2),
      }),
      makeTrack({
        id: "s",
        sound: "sd",
        steps: 4,
        pulses: 1,
        pattern: generateEuclideanPattern(4, 1),
      }),
    ];
    const result = tracksToStrudel(tracks, "struct");
    expect(result).toContain("stack(");
    expect(result).toContain('s("bd").struct("1 0 1 0")');
    expect(result).toContain('s("sd").struct("1 0 0 0")');
  });
});
