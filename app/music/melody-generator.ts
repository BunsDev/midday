import type { Chord } from "../lib/constants";
import { PhraseBuilder } from "./phrase-builder";

export class MelodyGenerator {
  private readonly melody: { note: string; duration: number }[] = [];
  private previousNote?: string;
  private direction = Math.random() < 0.5 ? 1 : -1;

  constructor(private readonly chords: Chord[]) {}

  public generate(): { note: string; duration: number }[] {
    for (let repeat = 0; repeat < 2; repeat++) {
      for (const chord of this.chords) {
        this.processChord(chord);
      }
    }
    return this.melody;
  }

  private processChord(chord: Chord) {
    const phraseBuilder = new PhraseBuilder(chord, this.direction, this.previousNote);
    const phraseNotes = phraseBuilder.buildPhrase();

    const phrase = phraseNotes.build();
    this.melody.push(...phrase);
    this.previousNote = phrase[phrase.length - 1]?.note;
  }
}
