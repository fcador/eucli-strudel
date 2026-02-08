import React from "react";
import { Circle as SvgCircle, G } from "react-native-svg";
import { rotatePattern } from "../utils/euclidean";

interface TrackCircleProps {
  cx: number;
  cy: number;
  radius: number;
  pattern: number[];
  steps: number;
  rotation: number;
  currentStep: number;
  isPlaying: boolean;
  color: string;
  glowColor: string;
  dimColor: string;
  trackId: string;
}

function TrackCircle({
  cx,
  cy,
  radius,
  pattern,
  steps,
  rotation,
  currentStep,
  isPlaying,
  color,
  glowColor,
  dimColor,
  trackId,
}: TrackCircleProps) {
  const rotated = rotatePattern(pattern, rotation);
  const dots = Array.from({ length: steps }, (_, i) => {
    const angle = (2 * Math.PI * i) / steps - Math.PI / 2;
    const dotX = cx + radius * Math.cos(angle);
    const dotY = cy + radius * Math.sin(angle);
    const isActive = rotated[i] === 1;
    const isCurrent = isPlaying && currentStep % steps === i;
    const dotRadius = isCurrent ? 7 : isActive ? 5 : 2.5;
    const fill = isCurrent ? glowColor : isActive ? color : dimColor;
    const opacity = isCurrent ? 1 : isActive ? 0.9 : 0.3;

    return (
      <SvgCircle
        key={`${trackId}-${i}`}
        cx={dotX}
        cy={dotY}
        r={dotRadius}
        fill={fill}
        opacity={opacity}
      />
    );
  });

  return (
    <G>
      <SvgCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={dimColor}
        strokeWidth={0.5}
        fill="none"
        opacity={0.15}
      />
      {dots}
    </G>
  );
}

export default React.memo(TrackCircle);
