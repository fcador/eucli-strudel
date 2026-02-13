export type {
  Pattern,
  StrudelFormat,
  Track as BaseTrack,
} from "apx-ds";

import type { Track as BaseTrack, Pattern, StrudelFormat } from "apx-ds";

export interface Track extends BaseTrack {
  asset: ReturnType<typeof require>;
}

export interface SequencerState {
  tracks: Track[];
  isPlaying: boolean;
  currentStep: number;
  bpm: number;
  strudelFormat: StrudelFormat;
}

export interface SequencerActions {
  togglePlay: () => void;
  setPulses: (trackId: string, pulses: number) => void;
  setSteps: (trackId: string, steps: number) => void;
  setRotation: (trackId: string, rotation: number) => void;
  setVolume: (trackId: string, volume: number) => void;
  setBpm: (bpm: number) => void;
  toggleStrudelFormat: () => void;
  tick: () => void;
  getStrudelCode: () => string;
}

export type SequencerStore = SequencerState & SequencerActions;
