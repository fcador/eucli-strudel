import React, { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { useSequencerStore } from "../store/useSequencerStore";
import { UI } from "../constants/colors";

const BPM_PRESETS = [80, 100, 120, 140, 160];

export default function PlayControls() {
  const isPlaying = useSequencerStore((s) => s.isPlaying);
  const bpm = useSequencerStore((s) => s.bpm);
  const togglePlay = useSequencerStore((s) => s.togglePlay);
  const setBpm = useSequencerStore((s) => s.setBpm);

  const cycleBpm = useCallback(() => {
    const currentIndex = BPM_PRESETS.indexOf(bpm);
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % BPM_PRESETS.length;
    setBpm(BPM_PRESETS[nextIndex]);
  }, [bpm, setBpm]);

  return (
    <View className="flex-row items-center justify-center gap-6 mt-6">
      <Pressable
        onPress={togglePlay}
        className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center active:bg-zinc-700 border border-zinc-700"
      >
        {isPlaying ? (
          <Pause size={24} color={UI.white} fill={UI.white} />
        ) : (
          <Play size={24} color={UI.white} fill={UI.white} />
        )}
      </Pressable>

      <Pressable onPress={cycleBpm} className="items-center">
        <Text
          style={{ fontFamily: "monospace" }}
          className="text-zinc-300 text-lg font-bold"
        >
          {bpm}
        </Text>
        <Text
          style={{ fontFamily: "monospace" }}
          className="text-zinc-600 text-[10px]"
        >
          BPM
        </Text>
      </Pressable>
    </View>
  );
}
