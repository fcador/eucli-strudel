export const SCHEDULE_AHEAD_TIME = 0.1;
export const LOOKAHEAD_INTERVAL = 25;

export interface SchedulerState {
  nextStepTime: number;
  currentStep: number;
}

export function getStepDuration(bpm: number): number {
  return 60 / bpm / 4;
}
