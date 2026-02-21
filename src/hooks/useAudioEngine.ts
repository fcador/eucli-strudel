import { useEffect, useRef, useCallback } from "react";
import {
  AudioContext,
  AudioBuffer,
  GainNode,
  decodeAudioData,
} from "react-native-audio-api";
import { useSequencerStore } from "../store/useSequencerStore";
import { rotatePattern } from "../utils/euclidean";
import {
  SCHEDULE_AHEAD_TIME,
  LOOKAHEAD_INTERVAL,
  getStepDuration,
  type SchedulerState,
} from "./useAudioScheduler";

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const schedulerRef = useRef<SchedulerState>({
    nextStepTime: 0,
    currentStep: 0,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPlaying = useSequencerStore((s) => s.isPlaying);
  const bpm = useSequencerStore((s) => s.bpm);
  const tracks = useSequencerStore((s) => s.tracks);
  const tick = useSequencerStore((s) => s.tick);

  useEffect(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const loadSounds = async () => {
      for (const track of tracks) {
        const buffer = await decodeAudioData(track.asset);
        buffersRef.current.set(track.id, buffer);

        const gainNode = ctx.createGain();
        gainNode.gain.value = track.volume;
        gainNode.connect(ctx.destination);
        gainNodesRef.current.set(track.id, gainNode);
      }
    };

    loadSounds();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ctx.close();
      buffersRef.current.clear();
      gainNodesRef.current.clear();
    };
  }, []);

  useEffect(() => {
    for (const track of tracks) {
      const gainNode = gainNodesRef.current.get(track.id);
      if (gainNode && gainNode.gain.value !== track.volume) {
        gainNode.gain.value = track.volume;
      }
    }
  }, [tracks]);

  const playSound = useCallback((trackId: string, time: number) => {
    const ctx = ctxRef.current;
    const buffer = buffersRef.current.get(trackId);
    const gainNode = gainNodesRef.current.get(trackId);
    if (!ctx || !buffer || !gainNode) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    source.start(time);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      schedulerRef.current = { nextStepTime: 0, currentStep: 0 };
      return;
    }

    const ctx = ctxRef.current;
    if (!ctx) return;

    const stepDuration = getStepDuration(bpm);
    schedulerRef.current.nextStepTime = ctx.currentTime;
    schedulerRef.current.currentStep = 0;

    const scheduleLoop = () => {
      if (!ctxRef.current) return;

      while (
        schedulerRef.current.nextStepTime <
        ctxRef.current.currentTime + SCHEDULE_AHEAD_TIME
      ) {
        const { tracks: currentTracks } = useSequencerStore.getState();

        currentTracks.forEach((track) => {
          const rotated = rotatePattern(track.pattern, track.rotation);
          const stepIndex =
            schedulerRef.current.currentStep % track.steps;
          if (rotated[stepIndex] === 1) {
            playSound(track.id, schedulerRef.current.nextStepTime);
          }
        });

        tick();
        schedulerRef.current.nextStepTime += stepDuration;
        schedulerRef.current.currentStep++;
      }

      timerRef.current = setTimeout(scheduleLoop, LOOKAHEAD_INTERVAL);
    };

    scheduleLoop();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, bpm, tick, playSound]);
}
