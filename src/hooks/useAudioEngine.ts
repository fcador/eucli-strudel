import { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { useSequencerStore } from "../store/useSequencerStore";

export function useAudioEngine() {
  const soundsRef = useRef<Map<string, Audio.Sound>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPlaying = useSequencerStore((s) => s.isPlaying);
  const bpm = useSequencerStore((s) => s.bpm);
  const tracks = useSequencerStore((s) => s.tracks);
  const tick = useSequencerStore((s) => s.tick);

  useEffect(() => {
    const loadSounds = async () => {
      for (const track of tracks) {
        const { sound } = await Audio.Sound.createAsync(track.asset);
        soundsRef.current.set(track.id, sound);
      }
    };
    loadSounds();

    return () => {
      soundsRef.current.forEach((sound) => sound.unloadAsync());
      soundsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    const stepDurationMs = (60 / bpm / 4) * 1000;

    intervalRef.current = setInterval(() => {
      const state = useSequencerStore.getState();
      const { currentStep, tracks: currentTracks } = state;

      currentTracks.forEach(async (track) => {
        const stepIndex = currentStep % track.steps;
        if (track.pattern[stepIndex] === 1) {
          const sound = soundsRef.current.get(track.id);
          if (sound) {
            await sound.setVolumeAsync(track.volume);
            sound.replayAsync();
          }
        }
      });

      tick();
    }, stepDurationMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, tick]);
}
