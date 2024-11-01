import { CHROMATIC_SCALE, COMMON_DURATIONS, type Chord, MAJOR_SCALE_INTERVALS, MINOR_SCALE_INTERVALS } from "../lib/constants";

export class MusicTheory {
  private convertFlatToSharp(note: string): string {
    const noteToCheck = note.replace("m", "");

    const flatToSharpMap: { [key: string]: string } = {
      Db: "C#",
      Eb: "D#",
      Gb: "F#",
      Ab: "G#",
      Bb: "A#",
    };

    if (!(noteToCheck in flatToSharpMap) && CHROMATIC_SCALE.includes(noteToCheck)) {
      return noteToCheck; // Return the note if it is valid but not in the map
    }

    return flatToSharpMap[noteToCheck] || noteToCheck;
  }

  public getScaleNotes(root: string, scaleType: "major" | "minor"): string[] {
    const normalizedRoot = this.convertFlatToSharp(root);
    const scaleIntervals = scaleType === "major" ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
    const rootIndex = CHROMATIC_SCALE.indexOf(normalizedRoot);
    return scaleIntervals.map((interval) => CHROMATIC_SCALE[(rootIndex + interval) % 12]).filter((note) => note !== undefined);
  }

  public getChordTones(chord: Chord): string[] {
    const root = this.convertFlatToSharp(chord);
    const scaleType = this.getScaleType(chord);
    const scaleNotes = this.getScaleNotes(root, scaleType);

    return [scaleNotes[0], scaleNotes[2], scaleNotes[4]].filter((note) => note !== undefined);
  }

  public getScaleType(chord: Chord): "major" | "minor" {
    return chord.includes("m") ? "minor" : "major";
  }

  public quantizeDuration = (duration: number): number => {
    return COMMON_DURATIONS.reduce((a, b) => (Math.abs(b - duration) < Math.abs(a - duration) ? b : a));
  };
}
