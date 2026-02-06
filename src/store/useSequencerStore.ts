import { create } from "zustand";
import { SequencerStore, Track } from "../types/sequencer";
import { generateEuclideanPattern } from "../utils/euclidean";
import { tracksToStrudel } from "../utils/strudel";

const DEFAULT_TRACKS: Track[] = [
  {
    id: "kick",
    label: "Kick",
    sound: "bd",
    steps: 16,
    pulses: 4,
    pattern: generateEuclideanPattern(16, 4),
  },
  {
    id: "snare",
    label: "Snare",
    sound: "sd",
    steps: 16,
    pulses: 2,
    pattern: generateEuclideanPattern(16, 2),
  },
  {
    id: "hihat",
    label: "Hi-hat",
    sound: "hh",
    steps: 16,
    pulses: 8,
    pattern: generateEuclideanPattern(16, 8),
  },
];

export const useSequencerStore = create<SequencerStore>()((set, get) => ({
  tracks: DEFAULT_TRACKS,
  isPlaying: false,
  currentStep: 0,
  bpm: 120,

  togglePlay: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
      currentStep: state.isPlaying ? 0 : state.currentStep,
    })),

  setPulses: (trackId, pulses) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id !== trackId) return track;
        const clamped = Math.max(0, Math.min(pulses, track.steps));
        return {
          ...track,
          pulses: clamped,
          pattern: generateEuclideanPattern(track.steps, clamped),
        };
      }),
    })),

  setSteps: (trackId, steps) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id !== trackId) return track;
        const clampedSteps = Math.max(1, Math.min(steps, 32));
        const clampedPulses = Math.min(track.pulses, clampedSteps);
        return {
          ...track,
          steps: clampedSteps,
          pulses: clampedPulses,
          pattern: generateEuclideanPattern(clampedSteps, clampedPulses),
        };
      }),
    })),

  setBpm: (bpm) => set({ bpm: Math.max(40, Math.min(bpm, 300)) }),

  tick: () =>
    set((state) => {
      const maxSteps = Math.max(...state.tracks.map((t) => t.steps));
      return { currentStep: (state.currentStep + 1) % maxSteps };
    }),

  getStrudelCode: () => tracksToStrudel(get().tracks),
}));
