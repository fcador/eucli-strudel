import React, { useRef } from "react";
import { View, PanResponder, useWindowDimensions } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
import TrackCircle from "./TrackCircle";
import { TRACK_COLORS } from "../constants/colors";
import { useSequencerStore } from "../store/useSequencerStore";

const RADII_RATIOS = [0.42, 0.29, 0.16];

export default function SolarSystem() {
  const { width, height } = useWindowDimensions();
  const tracks = useSequencerStore((s) => s.tracks);
  const currentStep = useSequencerStore((s) => s.currentStep);
  const isPlaying = useSequencerStore((s) => s.isPlaying);
  const setPulses = useSequencerStore((s) => s.setPulses);
  const setRotation = useSequencerStore((s) => s.setRotation);

  const size = Math.min(width, height) * 0.85;
  const center = size / 2;
  const radii = RADII_RATIOS.map((r) => size * r);

  const panRef = useRef({ trackId: "", lastStepsY: 0, lastStepsX: 0 });

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

        panRef.current = { trackId: closestTrackId, lastStepsY: 0, lastStepsX: 0 };
      },
      onPanResponderMove: (_, gestureState) => {
        if (!panRef.current.trackId) return;
        const threshold = 30;

        const stepsY = Math.round(gestureState.dy / threshold);
        if (stepsY !== panRef.current.lastStepsY) {
          const delta = panRef.current.lastStepsY - stepsY;
          const track = useSequencerStore
            .getState()
            .tracks.find((t) => t.id === panRef.current.trackId);
          if (track) {
            setPulses(track.id, track.pulses + delta);
          }
          panRef.current.lastStepsY = stepsY;
        }

        const stepsX = Math.round(gestureState.dx / threshold);
        if (stepsX !== panRef.current.lastStepsX) {
          const delta = stepsX - panRef.current.lastStepsX;
          const track = useSequencerStore
            .getState()
            .tracks.find((t) => t.id === panRef.current.trackId);
          if (track) {
            setRotation(track.id, track.rotation + delta);
          }
          panRef.current.lastStepsX = stepsX;
        }
      },
      onPanResponderRelease: () => {
        panRef.current = { trackId: "", lastStepsY: 0, lastStepsX: 0 };
      },
    })
  ).current;

  return (
    <View
      className="items-center justify-center mb-16"
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
                  rotation={track.rotation}
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
                  {track.label} {track.pulses}/{track.steps}{track.rotation > 0 ? `+${track.rotation}` : ""}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}
