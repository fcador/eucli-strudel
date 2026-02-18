import { useSequencerStore } from "../useSequencerStore";

const getState = () => useSequencerStore.getState();
const getTrack = (id: string) => getState().tracks.find((t) => t.id === id)!;

beforeEach(() => {
  useSequencerStore.setState(useSequencerStore.getInitialState());
});

describe("setBpm", () => {
  it("accepts in-range value", () => {
    getState().setBpm(100);
    expect(getState().bpm).toBe(100);
  });

  it("clamps below min to 40", () => {
    getState().setBpm(20);
    expect(getState().bpm).toBe(40);
  });

  it("clamps above max to 300", () => {
    getState().setBpm(400);
    expect(getState().bpm).toBe(300);
  });

  it("accepts boundary value 40", () => {
    getState().setBpm(40);
    expect(getState().bpm).toBe(40);
  });

  it("accepts boundary value 300", () => {
    getState().setBpm(300);
    expect(getState().bpm).toBe(300);
  });
});

describe("setPulses", () => {
  it("updates pulses and regenerates pattern", () => {
    getState().setPulses("kick", 6);
    const track = getTrack("kick");
    expect(track.pulses).toBe(6);
    expect(track.pattern.length).toBe(track.steps);
    expect(track.pattern.filter((v) => v === 1).length).toBe(6);
  });

  it("clamps pulses above steps to steps", () => {
    getState().setPulses("kick", 20);
    expect(getTrack("kick").pulses).toBe(16);
  });

  it("clamps negative pulses to 0", () => {
    getState().setPulses("kick", -5);
    const track = getTrack("kick");
    expect(track.pulses).toBe(0);
    expect(track.pattern.every((v) => v === 0)).toBe(true);
  });

  it("does not modify other tracks", () => {
    const snareBefore = getTrack("snare");
    getState().setPulses("kick", 8);
    expect(getTrack("snare")).toBe(snareBefore);
  });

  it("pattern length always matches steps", () => {
    getState().setPulses("hihat", 3);
    const track = getTrack("hihat");
    expect(track.pattern.length).toBe(track.steps);
  });
});

describe("setSteps", () => {
  it("clamps steps below 1 to 1", () => {
    getState().setSteps("kick", 0);
    expect(getTrack("kick").steps).toBe(1);
  });

  it("clamps steps above 32 to 32", () => {
    getState().setSteps("kick", 64);
    expect(getTrack("kick").steps).toBe(32);
  });

  it("clamps pulses down when steps shrinks below current pulses", () => {
    getState().setPulses("kick", 10);
    getState().setSteps("kick", 6);
    const track = getTrack("kick");
    expect(track.steps).toBe(6);
    expect(track.pulses).toBe(6);
  });

  it("resets rotation to 0 when rotation >= new steps", () => {
    getState().setRotation("kick", 12);
    getState().setSteps("kick", 8);
    expect(getTrack("kick").rotation).toBe(0);
  });

  it("preserves rotation when rotation < new steps", () => {
    getState().setRotation("kick", 3);
    getState().setSteps("kick", 8);
    expect(getTrack("kick").rotation).toBe(3);
  });

  it("regenerates pattern with new dimensions", () => {
    getState().setSteps("kick", 8);
    const track = getTrack("kick");
    expect(track.pattern.length).toBe(8);
    expect(track.pattern.filter((v) => v === 1).length).toBe(track.pulses);
  });
});

describe("setRotation", () => {
  it("keeps 0 as 0", () => {
    getState().setRotation("kick", 0);
    expect(getTrack("kick").rotation).toBe(0);
  });

  it("preserves in-range value", () => {
    getState().setRotation("kick", 5);
    expect(getTrack("kick").rotation).toBe(5);
  });

  it("wraps rotation equal to steps to 0", () => {
    getState().setRotation("kick", 16);
    expect(getTrack("kick").rotation).toBe(0);
  });

  it("wraps negative rotation to positive", () => {
    getState().setRotation("kick", -1);
    expect(getTrack("kick").rotation).toBe(15);
  });

  it("wraps rotation greater than steps", () => {
    getState().setRotation("kick", 19);
    expect(getTrack("kick").rotation).toBe(3);
  });
});

describe("setVolume", () => {
  it("accepts in-range value", () => {
    getState().setVolume("kick", 0.5);
    expect(getTrack("kick").volume).toBe(0.5);
  });

  it("clamps below 0 to 0", () => {
    getState().setVolume("kick", -0.1);
    expect(getTrack("kick").volume).toBe(0);
  });

  it("clamps above 1 to 1", () => {
    getState().setVolume("kick", 1.5);
    expect(getTrack("kick").volume).toBe(1);
  });
});

describe("togglePlay", () => {
  it("starts playing (false -> true)", () => {
    expect(getState().isPlaying).toBe(false);
    getState().togglePlay();
    expect(getState().isPlaying).toBe(true);
  });

  it("stops playing and resets currentStep (true -> false)", () => {
    getState().togglePlay();
    getState().tick();
    getState().tick();
    expect(getState().currentStep).toBeGreaterThan(0);

    getState().togglePlay();
    expect(getState().isPlaying).toBe(false);
    expect(getState().currentStep).toBe(0);
  });
});

describe("tick", () => {
  it("increments currentStep by 1", () => {
    getState().tick();
    expect(getState().currentStep).toBe(1);
  });

  it("wraps at max steps across all tracks", () => {
    for (let i = 0; i < 15; i++) getState().tick();
    expect(getState().currentStep).toBe(15);
    getState().tick();
    expect(getState().currentStep).toBe(0);
  });

  it("wraps at the largest step count when tracks differ", () => {
    getState().setSteps("kick", 8);
    for (let i = 0; i < 16; i++) getState().tick();
    expect(getState().currentStep).toBe(0);
  });
});

describe("toggleStrudelFormat", () => {
  it("toggles from euclidean to struct", () => {
    expect(getState().strudelFormat).toBe("euclidean");
    getState().toggleStrudelFormat();
    expect(getState().strudelFormat).toBe("struct");
  });

  it("toggles back from struct to euclidean", () => {
    getState().toggleStrudelFormat();
    getState().toggleStrudelFormat();
    expect(getState().strudelFormat).toBe("euclidean");
  });
});

describe("getStrudelCode", () => {
  it("returns a non-empty string with default tracks", () => {
    const code = getState().getStrudelCode();
    expect(code).toBeTruthy();
    expect(typeof code).toBe("string");
  });
});
