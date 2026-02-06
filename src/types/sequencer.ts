export type Pattern = number[];

export interface Track {
  id: string;
  label: string;
  sound: string;
  asset: ReturnType<typeof require>;
  steps: number;
  pulses: number;
  pattern: Pattern;
  volume: number;
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
  setVolume: (trackId: string, volume: number) => void;
  setBpm: (bpm: number) => void;
  tick: () => void;
  getStrudelCode: () => string;
}

export type SequencerStore = SequencerState & SequencerActions;
