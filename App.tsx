import "./global.css";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import SolarSystem from "./src/components/SolarSystem";
import PlayControls from "./src/components/PlayControls";
import { useAudioEngine } from "./src/hooks/useAudioEngine";

export default function App() {
  useAudioEngine();

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center">
        <SolarSystem />
        <PlayControls />
      </View>
    </SafeAreaView>
  );
}
