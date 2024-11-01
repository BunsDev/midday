// Constants
export const CHROMATIC_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
export const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
export const COMMON_DURATIONS = [0.25, 0.5, 0.75, 1, 1.5, 2];
export const RHYTHMIC_PATTERNS = [
  [1, 1, 1, 1],
  [0.5, 0.5, 1, 1, 1],
  [1, 0.5, 0.5, 1, 1],
  [0.5, 0.5, 0.5, 0.5, 1, 1],
  [1, 1, 0.5, 0.5, 1],
  [0.5, 1, 0.5, 1, 1],
  [0.25, 0.25, 0.5, 1, 1, 1],
  [1, 0.75, 0.25, 1, 1],
];

export const CHORD_MAP = {
  C: ["C4", "E4", "G4"],
  G: ["G3", "B3", "D4"],
  A: ["A3", "C#4", "E4"],
  Am: ["A3", "C4", "E4"],
  F: ["F3", "A3", "C4"],
  D: ["D4", "F#4", "A4"],
  Em: ["E4", "G4", "B4"],
  Dm: ["D4", "F4", "A4"],
  Bb: ["Bb3", "D4", "F4"],
  E: ["E4", "G#4", "B4"],
  Bm: ["B3", "D4", "F#4"],
  Fm: ["F3", "Ab3", "C4"],
  Db: ["Db4", "F4", "Ab4"],
  Ab: ["Ab3", "C4", "Eb4"],
  Eb: ["Eb4", "G4", "Bb4"],
  B: ["B3", "D#4", "F#4"],
};
export type Chord = keyof typeof CHORD_MAP;

export const EMOTIONS = ["euphoric", "happy", "sorrow", "sad", "joyful", "creepy"] as const;
export type Emotion = (typeof EMOTIONS)[number];

export const EMOTION_CHORDS = {
  euphoric: [
    ["C", "Am", "F", "G"],
    ["G", "D", "Em", "C"],
    ["F", "Am", "C", "G"],
    ["C", "G", "Am", "F"],
  ],
  happy: [
    ["C", "G", "Am", "F"],
    ["G", "D", "Em", "C"],
    ["F", "C", "G", "Am"],
  ],
  sorrow: [
    ["Am", "F", "C", "G"],
    ["Dm", "Bb", "F", "C"],
    ["Em", "Am", "D", "G"],
  ],
  sad: [
    ["Am", "Em", "G", "F"],
    ["Dm", "Am", "C", "F"],
    ["Fm", "Db", "Ab", "Eb"],
  ],
  joyful: [
    ["D", "A", "Bm", "G"],
    ["C", "F", "G", "Am"],
    ["G", "C", "D", "Em"],
  ],
  creepy: [
    ["Dm", "Bb", "C", "A"],
    ["Em", "G", "Am", "B"],
    ["Fm", "Ab", "Bb", "C"],
  ],
} satisfies {
  [x: string]: Chord[][];
};
