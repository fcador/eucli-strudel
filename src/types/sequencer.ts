export type Pattern = number[];

export interface Track {
  id: string;
  label: string;
  sound: string;
  steps: number;
  pulses: number;
  pattern: Pattern;
}

export interface SequencerState {
  tracks: Track[];
  isPlaying: boolean;
  currentStep: number;
  bpm: number;
}

export interface SequencerActions {
  togglePlay: () => void;
  setPulses: (trackId: string, pulses: number) => void;
  setSteps: (trackId: string, steps: number) => void;
  setBpm: (bpm: number) => void;
  tick: () => void;
  getStrudelCode: () => string;
}

export type SequencerStore = SequencerState & SequencerActions;
