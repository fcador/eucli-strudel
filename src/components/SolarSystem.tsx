import React, { useRef } from "react";
import { View, PanResponder, useWindowDimensions } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
import TrackCircle from "./TrackCircle";
import CodeDisplay from "./CodeDisplay";
import { TRACK_COLORS } from "../constants/colors";
import { useSequencerStore } from "../store/useSequencerStore";

const RADII_RATIOS = [0.38, 0.28, 0.18];

export default function SolarSystem() {
  const { width, height } = useWindowDimensions();
  const tracks = useSequencerStore((s) => s.tracks);
  const currentStep = useSequencerStore((s) => s.currentStep);
  const isPlaying = useSequencerStore((s) => s.isPlaying);
  const setPulses = useSequencerStore((s) => s.setPulses);
  const getStrudelCode = useSequencerStore((s) => s.getStrudelCode);

  const size = Math.min(width, height) * 0.85;
  const center = size / 2;
  const radii = RADII_RATIOS.map((r) => size * r);
  const codeSize = radii[2] * 2 - 20;

  const panRef = useRef({ trackId: "", lastSteps: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const dx = locationX - center;
        const dy = locationY - center;
        const touchRadius = Math.sqrt(dx * dx + dy * dy);

        let closestTrackId = "";
        let minDist = Infinity;
        const currentTracks = useSequencerStore.getState().tracks;
        currentTracks.forEach((track, index) => {
          const dist = Math.abs(touchRadius - radii[index]);
          if (dist < minDist && dist < 30) {
            minDist = dist;
            closestTrackId = track.id;
          }
        });

        panRef.current = { trackId: closestTrackId, lastSteps: 0 };
      },
      onPanResponderMove: (_, gestureState) => {
        if (!panRef.current.trackId) return;
        const threshold = 30;
        const steps = Math.round(gestureState.dy / threshold);

        if (steps !== panRef.current.lastSteps) {
          const delta = panRef.current.lastSteps - steps;
          const track = useSequencerStore
            .getState()
            .tracks.find((t) => t.id === panRef.current.trackId);
          if (track) {
            setPulses(track.id, track.pulses + delta);
          }
          panRef.current.lastSteps = steps;
        }
      },
      onPanResponderRelease: () => {
        panRef.current = { trackId: "", lastSteps: 0 };
      },
    })
  ).current;

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <View {...panResponder.panHandlers}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {tracks.map((track, index) => {
            const colors = TRACK_COLORS[track.id];
            return (
              <React.Fragment key={track.id}>
                <TrackCircle
                  cx={center}
                  cy={center}
                  radius={radii[index]}
                  pattern={track.pattern}
                  steps={track.steps}
                  currentStep={currentStep}
                  isPlaying={isPlaying}
                  color={colors.active}
                  glowColor={colors.glow}
                  dimColor={colors.dim}
                  trackId={track.id}
                />
                <SvgText
                  x={center}
                  y={center + radii[index] + 14}
                  textAnchor="middle"
                  fill={colors.active}
                  fontSize={10}
                  fontFamily="monospace"
                  opacity={0.7}
                >
                  {track.label} {track.pulses}/{track.steps}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
      <CodeDisplay code={getStrudelCode()} size={codeSize} />
    </View>
  );
}
