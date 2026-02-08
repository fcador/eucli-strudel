import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { UI } from "../constants/colors";

const HELP_ITEMS = [
  "Swipe up/down on a circle to change pulses",
  "Tap the code panel to switch notation format",
  "Tap copy to copy the Strudel code",
  "Use sliders to adjust volume per track",
  "Tap BPM to cycle through tempo presets",
];

export default function HelpOverlay() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="absolute top-2 right-4 w-7 h-7 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700"
      >
        <Text
          style={{ fontFamily: "monospace", color: UI.chrome }}
          className="text-xs font-bold"
        >
          ?
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          onPress={() => setVisible(false)}
          className="flex-1 items-center justify-center bg-black/85"
        >
          <View className="bg-zinc-900 rounded-2xl px-6 py-5 mx-8 max-w-xs border border-zinc-800">
            <Text
              style={{ fontFamily: "monospace", color: UI.white }}
              className="text-base font-bold mb-3"
            >
              Eucli Strudel
            </Text>
            <Text
              style={{ fontFamily: "monospace", color: UI.chrome }}
              className="text-xs mb-4 leading-relaxed"
            >
              Euclidean rhythm sequencer generating Strudel.cc code.
            </Text>
            {HELP_ITEMS.map((item) => (
              <Text
                key={item}
                style={{ fontFamily: "monospace", color: UI.chrome }}
                className="text-[11px] mb-1.5 leading-snug"
              >
                {item}
              </Text>
            ))}
            <Pressable
              onPress={() => setVisible(false)}
              className="mt-4 py-2 rounded-lg bg-zinc-800 items-center active:bg-zinc-700"
            >
              <Text
                style={{ fontFamily: "monospace", color: UI.white }}
                className="text-xs font-bold"
              >
                Got it
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
