import type { Chord } from "../lib/constants";
import { PhraseBuilder } from "./phrase-builder";

export class MelodyGenerator {
  private readonly melody: { note: string; duration: number }[] = [];
  private previousNote: string | null = null;
  private direction = Math.random() < 0.5 ? 1 : -1;

  constructor(private readonly chords: Chord[]) {}

  public generate(): { note: string; duration: number }[] {
    console.log("Generating melody...");
    for (let repeat = 0; repeat < 2; repeat++) {
      this.chords.forEach((chord, chordIndex) => {
        this.processChord(chord, chordIndex, repeat);
      });
    }
    return this.melody;
  }

  private processChord(chord: Chord, chordIndex: number, repeat: number) {
    console.log(`Processing chord ${chordIndex + 1}/${this.chords.length}... ${chord}`);
    const phraseBuilder = new PhraseBuilder(chord, this.direction, this.previousNote);
    const phraseNotes = phraseBuilder.buildPhrase();

    if (chordIndex === this.chords.length - 1 && repeat === 1) {
      console.log("Adding phrase variation...");

      phraseNotes.addPhraseVariation();
    }

    const phrase = phraseNotes.build();
    this.melody.push(...phrase);
    this.previousNote = phrase[phrase.length - 1].note;
  }
}
