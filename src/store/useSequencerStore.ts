import { create } from "zustand";
import { generateEuclideanPattern, tracksToStrudel } from "apx-ds/utils";
import { SequencerStore, Track } from "../types/sequencer";

const DEFAULT_TRACKS: Track[] = [
  {
    id: "kick",
    label: "Kick",
    sound: "bd",
    asset: require("../../assets/sounds/kick.wav"),
    steps: 16,
    pulses: 4,
    rotation: 0,
    pattern: generateEuclideanPattern(16, 4),
    volume: 0.7,
  },
  {
    id: "snare",
    label: "Snare",
    sound: "sd",
    asset: require("../../assets/sounds/snare.wav"),
    steps: 16,
    pulses: 2,
    rotation: 0,
    pattern: generateEuclideanPattern(16, 2),
    volume: 0.7,
  },
  {
    id: "hihat",
    label: "Hi-hat",
    sound: "hh",
    asset: require("../../assets/sounds/hihat.wav"),
    steps: 16,
    pulses: 8,
    rotation: 0,
    pattern: generateEuclideanPattern(16, 8),
    volume: 0.7,
  },
];

export const useSequencerStore = create<SequencerStore>()((set, get) => ({
  tracks: DEFAULT_TRACKS,
  isPlaying: false,
  currentStep: 0,
  bpm: 120,
  strudelFormat: "euclidean",

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
        const clampedRotation =
          track.rotation >= clampedSteps ? 0 : track.rotation;
        return {
          ...track,
          steps: clampedSteps,
          pulses: clampedPulses,
          rotation: clampedRotation,
          pattern: generateEuclideanPattern(clampedSteps, clampedPulses),
        };
      }),
    })),

  setRotation: (trackId, rotation) =>
    set((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id !== trackId) return track;
        const clamped =
          ((rotation % track.steps) + track.steps) % track.steps;
        return { ...track, rotation: clamped };
      }),
    })),

  setVolume: (trackId, volume) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, volume: Math.max(0, Math.min(volume, 1)) }
          : track
      ),
    })),

  setBpm: (bpm) => set({ bpm: Math.max(40, Math.min(bpm, 300)) }),

  toggleStrudelFormat: () =>
    set((state) => ({
      strudelFormat:
        state.strudelFormat === "euclidean" ? "struct" : "euclidean",
    })),

  tick: () =>
    set((state) => {
      const maxSteps = Math.max(...state.tracks.map((t) => t.steps));
      return { currentStep: (state.currentStep + 1) % maxSteps };
    }),

  getStrudelCode: () => tracksToStrudel(get().tracks, get().strudelFormat),
}));
