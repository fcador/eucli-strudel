import { generateEuclideanPattern, rotatePattern } from "../euclidean";

describe("generateEuclideanPattern", () => {
  it("returns all 1s when pulses >= steps", () => {
    expect(generateEuclideanPattern(4, 4)).toEqual([1, 1, 1, 1]);
    expect(generateEuclideanPattern(4, 5)).toEqual([1, 1, 1, 1]);
  });

  it("returns all 0s when pulses <= 0", () => {
    expect(generateEuclideanPattern(4, 0)).toEqual([0, 0, 0, 0]);
    expect(generateEuclideanPattern(4, -1)).toEqual([0, 0, 0, 0]);
  });

  it("returns correct length", () => {
    expect(generateEuclideanPattern(8, 3).length).toBe(8);
    expect(generateEuclideanPattern(16, 4).length).toBe(16);
    expect(generateEuclideanPattern(32, 7).length).toBe(32);
  });

  it("contains the right number of pulses", () => {
    expect(generateEuclideanPattern(8, 3).filter((v) => v === 1).length).toBe(3);
    expect(generateEuclideanPattern(16, 4).filter((v) => v === 1).length).toBe(4);
    expect(generateEuclideanPattern(16, 9).filter((v) => v === 1).length).toBe(9);
  });

  it("produces E(3,8) tresillo pattern", () => {
    expect(generateEuclideanPattern(8, 3)).toEqual([1, 0, 0, 1, 0, 0, 1, 0]);
  });

  it("produces E(4,16) four-on-the-floor", () => {
    expect(generateEuclideanPattern(16, 4)).toEqual([
      1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    ]);
  });

  it("produces E(5,8)", () => {
    expect(generateEuclideanPattern(8, 5)).toEqual([1, 0, 1, 1, 0, 1, 1, 0]);
  });

  it("produces E(2,5)", () => {
    expect(generateEuclideanPattern(5, 2)).toEqual([1, 0, 1, 0, 0]);
  });

  it("handles steps=1, pulses=1", () => {
    expect(generateEuclideanPattern(1, 1)).toEqual([1]);
  });

  it("handles steps=1, pulses=0", () => {
    expect(generateEuclideanPattern(1, 0)).toEqual([0]);
  });

  it("handles max steps=32", () => {
    const pattern = generateEuclideanPattern(32, 7);
    expect(pattern.length).toBe(32);
    expect(pattern.filter((v) => v === 1).length).toBe(7);
  });
});

describe("rotatePattern", () => {
  it("returns same pattern when rotation is 0", () => {
    expect(rotatePattern([1, 0, 0, 1], 0)).toEqual([1, 0, 0, 1]);
  });

  it("shifts left by 1", () => {
    expect(rotatePattern([1, 0, 0, 1], 1)).toEqual([0, 0, 1, 1]);
  });

  it("shifts left by 2", () => {
    expect(rotatePattern([1, 0, 0, 1], 2)).toEqual([0, 1, 1, 0]);
  });

  it("wraps negative rotation", () => {
    expect(rotatePattern([1, 0, 0, 1], -1)).toEqual([1, 1, 0, 0]);
  });

  it("wraps rotation >= length", () => {
    expect(rotatePattern([1, 0, 0, 1], 4)).toEqual([1, 0, 0, 1]);
    expect(rotatePattern([1, 0, 0, 1], 5)).toEqual([0, 0, 1, 1]);
  });

  it("returns empty for empty pattern", () => {
    expect(rotatePattern([], 3)).toEqual([]);
  });

  it("full rotation returns same pattern", () => {
    const p = [1, 0, 1, 0, 0];
    expect(rotatePattern(p, p.length)).toEqual(p);
  });
});
