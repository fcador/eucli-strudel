import "./global.css";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import {
  SolarSystem,
  VolumeSliders,
  PlayControls,
  CodeDisplay,
  HelpOverlay,
} from "apx-ds/components";
import { useAudioEngine } from "./src/hooks/useAudioEngine";
import { useSequencerStore } from "./src/store/useSequencerStore";

const HELP_ITEMS = [
  "Swipe up/down on a circle to change pulses",
  "Swipe left/right on a circle to rotate the pattern",
  "Tap the code panel to switch notation format",
  "Tap copy to copy the Strudel code",
  "Use sliders to adjust volume per track",
  "Tap BPM to cycle through tempo presets",
];

export default function App() {
  useAudioEngine();

  const tracks = useSequencerStore((s) => s.tracks);
  const isPlaying = useSequencerStore((s) => s.isPlaying);
  const currentStep = useSequencerStore((s) => s.currentStep);
  const bpm = useSequencerStore((s) => s.bpm);
  const strudelFormat = useSequencerStore((s) => s.strudelFormat);
  const togglePlay = useSequencerStore((s) => s.togglePlay);
  const setBpm = useSequencerStore((s) => s.setBpm);
  const setPulses = useSequencerStore((s) => s.setPulses);
  const setRotation = useSequencerStore((s) => s.setRotation);
  const setVolume = useSequencerStore((s) => s.setVolume);
  const toggleStrudelFormat = useSequencerStore((s) => s.toggleStrudelFormat);
  const getStrudelCode = useSequencerStore((s) => s.getStrudelCode);

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center">
        <HelpOverlay
          title="Eucli Strudel"
          description="Euclidean rhythm sequencer generating Strudel.cc code."
          items={HELP_ITEMS}
        />
        <SolarSystem
          tracks={tracks}
          currentStep={currentStep}
          isPlaying={isPlaying}
          onPulsesChange={setPulses}
          onRotationChange={setRotation}
        />
        <VolumeSliders
          tracks={tracks}
          onVolumeChange={setVolume}
        />
        <PlayControls
          isPlaying={isPlaying}
          bpm={bpm}
          onTogglePlay={togglePlay}
          onBpmChange={setBpm}
        />
      </View>
      <CodeDisplay
        code={getStrudelCode()}
        formatLabel={strudelFormat === "euclidean" ? "E(k,n)" : "struct"}
        onToggleFormat={toggleStrudelFormat}
        onCopy={(code) => Clipboard.setStringAsync(code)}
      />
    </SafeAreaView>
  );
}
