import "./global.css";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import SolarSystem from "./src/components/SolarSystem";
import VolumeSliders from "./src/components/VolumeSliders";
import PlayControls from "./src/components/PlayControls";
import CodeDisplay from "./src/components/CodeDisplay";
import HelpOverlay from "./src/components/HelpOverlay";
import { useAudioEngine } from "./src/hooks/useAudioEngine";

export default function App() {
  useAudioEngine();

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center">
        <HelpOverlay />
        <SolarSystem />
        <VolumeSliders />
        <PlayControls />
      </View>
      <CodeDisplay />
    </SafeAreaView>
  );
}
