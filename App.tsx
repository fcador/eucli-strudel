import "./global.css";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSequencerStore } from "./src/store/useSequencerStore";

export default function App() {
  const tracks = useSequencerStore((state) => state.tracks);
  const getStrudelCode = useSequencerStore((state) => state.getStrudelCode);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <StatusBar style="light" />
      <Text className="text-white text-2xl font-bold mb-6">
        Eucli Strudel
      </Text>
      <Text className="text-emerald-400 text-xs mb-8 font-mono">
        {getStrudelCode()}
      </Text>
      {tracks.map((track) => (
        <Text key={track.id} className="text-zinc-500 text-xs mt-1 font-mono">
          {track.label}: [{track.pattern.join("")}]
        </Text>
      ))}
    </View>
  );
}
