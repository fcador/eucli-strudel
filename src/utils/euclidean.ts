import { Pattern } from "../types/sequencer";

export function generateEuclideanPattern(
  steps: number,
  pulses: number
): Pattern {
  if (pulses >= steps) return Array(steps).fill(1);
  if (pulses <= 0) return Array(steps).fill(0);

  let groups: number[][] = [];

  for (let i = 0; i < steps; i++) {
    groups.push(i < pulses ? [1] : [0]);
  }

  let splitIndex = pulses;
  let remainder = steps - pulses;

  while (remainder > 1) {
    const moveCount = Math.min(splitIndex, remainder);

    for (let i = 0; i < moveCount; i++) {
      groups[i] = [...groups[i], ...groups[groups.length - 1]];
      groups.pop();
    }

    remainder = groups.length - moveCount;
    splitIndex = moveCount;

    if (remainder <= 1) break;
  }

  return groups.flat();
}
