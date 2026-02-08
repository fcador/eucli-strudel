import React, { useCallback } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useSequencerStore } from "../store/useSequencerStore";
import { TRACK_COLORS } from "../constants/colors";

function TrackVolumeSlider({ trackId }: { trackId: string }) {
  const track = useSequencerStore((s) => s.tracks.find((t) => t.id === trackId));
  const setVolume = useSequencerStore((s) => s.setVolume);

  const handleValueChange = useCallback(
    (value: number) => setVolume(trackId, value),
    [trackId, setVolume]
  );

  if (!track) return null;

  const colors = TRACK_COLORS[trackId];

  return (
    <View className="flex-row items-center gap-4">
      <Text
        style={{ fontFamily: "monospace", color: colors.active, width: 44 }}
        className="text-[11px] text-right"
      >
        {track.label}
      </Text>
      <Slider
        style={{ flex: 1, height: 28 }}
        minimumValue={0}
        maximumValue={1}
        step={0.05}
        value={track.volume}
        onValueChange={handleValueChange}
        minimumTrackTintColor={colors.active}
        maximumTrackTintColor="#3f3f46"
        thumbTintColor={colors.active}
      />
      <Text
        style={{ fontFamily: "monospace", width: 28 }}
        className="text-zinc-500 text-[10px]"
      >
        {Math.round(track.volume * 100)}
      </Text>
    </View>
  );
}

export default function VolumeSliders() {
  const tracks = useSequencerStore((s) => s.tracks);

  return (
    <View className="w-full px-8 mt-2 gap-2">
      {tracks.map((track) => (
        <TrackVolumeSlider key={track.id} trackId={track.id} />
      ))}
    </View>
  );
}
