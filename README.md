# Eucli Strudel

An Euclidean rhythm sequencer that generates [Strudel.cc](https://strudel.cc) live-coding notation. Designed as a tactile, visual companion for Strudel-based performances and experimentation.

Drag your fingers on concentric circles to shape rhythms with the Bjorklund algorithm, hear them instantly, and copy the generated code straight into Strudel.

## How It Works

The app displays three concentric orbital rings, one per track (Kick, Snare, Hi-hat). Each ring arranges dots around a circle representing sequencer steps. Active pulses are distributed as evenly as possible using the [Euclidean/Bjorklund algorithm](https://en.wikipedia.org/wiki/Euclidean_rhythm).

The resulting pattern is converted in real time to valid Strudel.cc notation that you can copy and paste directly into the Strudel REPL.

### Interaction

- **Swipe up/down** on a ring to add or remove pulses
- **Swipe left/right** on a ring to rotate the pattern
- **Tap the code panel** to switch between `E(k,n)` and `struct` notation formats
- **Tap copy** to copy the Strudel code to clipboard
- **Adjust volume** per track with the sliders
- **Tap BPM** to cycle through tempo presets (80, 100, 120, 140, 160)

### Output Formats

**Euclidean notation** (default):
```javascript
stack(
  s("bd(4,16)"),
  s("sd(2,16)"),
  s("hh(8,16)")
)
```

**Struct notation**:
```javascript
stack(
  s("bd").struct("1 0 0 0 1 0 0 0 1 0 0 0 1 0 0 0"),
  s("sd").struct("1 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0"),
  s("hh").struct("1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0")
)
```

## Tech Stack

- **Expo SDK 54** with new architecture enabled
- **React Native** (iOS, Android, Web)
- **TypeScript** (strict mode)
- **NativeWind v4** (Tailwind CSS for React Native)
- **Zustand v5** for state management
- **expo-av** for audio playback
- **react-native-svg** for the circular sequencer UI
- **Lucide** icons

## Project Structure

```
App.tsx                          # Root component
src/
  types/sequencer.ts             # Track, Pattern, SequencerState types
  utils/euclidean.ts             # Bjorklund algorithm + pattern rotation
  utils/strudel.ts               # Tracks to Strudel code conversion
  store/useSequencerStore.ts     # Zustand store (state + actions)
  hooks/useAudioEngine.ts        # Audio playback engine
  constants/colors.ts            # Track colors and UI palette
  components/
    SolarSystem.tsx              # Orbital ring display + gesture handling
    TrackCircle.tsx              # Single track ring (SVG)
    PlayControls.tsx             # Play/pause + BPM
    VolumeSliders.tsx            # Per-track volume control
    CodeDisplay.tsx              # Strudel code output + copy
    HelpOverlay.tsx              # Help modal
assets/sounds/                   # TR-808 samples (kick, snare, hihat)
```

## Getting Started

### Prerequisites

- Node.js
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install and Run

```bash
git clone https://github.com/fcador/eucli-strudel.git
cd eucli-strudel
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or `w` for web.

## License

PolyForm Noncommercial License - Copyright (c) Fabien Cador

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to use,
copy, modify, and distribute the Software, subject to conditions. See [LICENSE](LICENSE) for details.
