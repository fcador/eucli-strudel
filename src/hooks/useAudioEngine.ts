import { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { useSequencerStore } from "../store/useSequencerStore";
import { rotatePattern } from "../utils/euclidean";

export function useAudioEngine() {
  const soundsRef = useRef<Map<string, Audio.Sound>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const volumesRef = useRef<Map<string, number>>(new Map());

  const isPlaying = useSequencerStore((s) => s.isPlaying);
  const bpm = useSequencerStore((s) => s.bpm);
  const tracks = useSequencerStore((s) => s.tracks);
  const tick = useSequencerStore((s) => s.tick);

  useEffect(() => {
    const loadSounds = async () => {
      for (const track of tracks) {
        const { sound } = await Audio.Sound.createAsync(track.asset);
        await sound.setVolumeAsync(track.volume);
        volumesRef.current.set(track.id, track.volume);
        soundsRef.current.set(track.id, sound);
      }
    };
    loadSounds();

    return () => {
      soundsRef.current.forEach((sound) => sound.unloadAsync());
      soundsRef.current.clear();
      volumesRef.current.clear();
    };
  }, []);

  useEffect(() => {
    for (const track of tracks) {
      const appliedVolume = volumesRef.current.get(track.id);
      if (appliedVolume === undefined || appliedVolume !== track.volume) {
        const sound = soundsRef.current.get(track.id);
        if (sound) {
          sound.setVolumeAsync(track.volume);
          volumesRef.current.set(track.id, track.volume);
        }
      }
    }
  }, [tracks]);

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

      currentTracks.forEach((track) => {
        const rotated = rotatePattern(track.pattern, track.rotation);
        const stepIndex = currentStep % track.steps;
        if (rotated[stepIndex] === 1) {
          const sound = soundsRef.current.get(track.id);
          if (sound) {
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
