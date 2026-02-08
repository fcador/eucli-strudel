import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Copy, Check } from "lucide-react-native";
import { UI } from "../constants/colors";

interface CodeDisplayProps {
  code: string;
  size: number;
}

export default function CodeDisplay({ code, size }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(24, 24, 27, 0.9)",
      }}
      className="items-center justify-center p-3 absolute"
    >
      <Text
        style={{ color: UI.codeText, fontFamily: "monospace", fontSize: 9 }}
        className="text-center leading-tight"
        numberOfLines={6}
      >
        {code}
      </Text>
      <Pressable
        onPress={handleCopy}
        className="mt-1.5 p-1.5 rounded-full bg-zinc-800 active:bg-zinc-700"
      >
        {copied ? (
          <Check size={12} color={UI.codeText} />
        ) : (
          <Copy size={12} color={UI.chrome} />
        )}
      </Pressable>
    </View>
  );
}
