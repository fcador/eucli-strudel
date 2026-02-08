import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Copy, Check } from "lucide-react-native";
import { UI } from "../constants/colors";
import { useSequencerStore } from "../store/useSequencerStore";

export default function CodeDisplay() {
  const [copied, setCopied] = useState(false);
  const getStrudelCode = useSequencerStore((s) => s.getStrudelCode);
  const strudelFormat = useSequencerStore((s) => s.strudelFormat);
  const toggleStrudelFormat = useSequencerStore((s) => s.toggleStrudelFormat);

  const code = getStrudelCode();

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <View className="w-full px-4 py-3 border-t border-zinc-800 bg-zinc-900/95">
      <Pressable onPress={toggleStrudelFormat}>
        <Text
          style={{ color: UI.codeText, fontFamily: "monospace", fontSize: 11 }}
          className="leading-snug"
          numberOfLines={4}
        >
          {code}
        </Text>
      </Pressable>
      <View className="flex-row items-center justify-between mt-2">
        <Pressable onPress={toggleStrudelFormat}>
          <Text
            style={{ fontFamily: "monospace", fontSize: 9 }}
            className="text-zinc-500"
          >
            {strudelFormat === "euclidean" ? "E(k,n)" : "struct"}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleCopy}
          className="flex-row items-center gap-1.5 p-1.5 rounded bg-zinc-800 active:bg-zinc-700"
        >
          {copied ? (
            <Check size={12} color={UI.codeText} />
          ) : (
            <Copy size={12} color={UI.chrome} />
          )}
          <Text
            style={{ fontFamily: "monospace", fontSize: 9 }}
            className="text-zinc-500"
          >
            {copied ? "copied" : "copy"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
