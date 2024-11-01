import { getRandomItem } from "../helpers/music";
import { type Chord, RHYTHMIC_PATTERNS } from "../lib/constants";
import { MusicTheory } from "./music-theory";
import { NoteSelector } from "./note-selector";

export class PhraseBuilder {
  private phraseNotes: { note: string; duration: number }[] = [];
  private scaleNotes: string[];
  private chordTones: string[];
  private musicTheory: MusicTheory;
  private direction: number;
  private rhythmPattern: number[];
  private currentBeat = 0;
  private rhythmIndex = 0;
  private previousNote: string | null;
  private noteSelector: NoteSelector;

  constructor(chord: Chord, direction: number, previousNote: string | null) {
    this.musicTheory = new MusicTheory();
    this.previousNote = previousNote;

    this.chordTones = this.musicTheory.getChordTones(chord);
    this.scaleNotes = this.musicTheory.getScaleNotes(chord, this.musicTheory.getScaleType(chord));

    this.direction = direction;

    this.rhythmPattern = getRandomItem(RHYTHMIC_PATTERNS);

    this.noteSelector = new NoteSelector(this.previousNote, this.direction);
  }

  private addNoteWithApproach(note: string, rhythmValue: number) {
    if (Math.random() < 0.2 && this.currentBeat + rhythmValue < 2) {
      const approachNote = `${this.scaleNotes[(this.scaleNotes.indexOf(note[0]) - this.direction + 7) % 7]}4`;
      const approachDuration = this.musicTheory.quantizeDuration(rhythmValue / 4);
      const mainNoteDuration = this.musicTheory.quantizeDuration(rhythmValue - approachDuration);
      this.phraseNotes.push({ note: approachNote, duration: approachDuration });
      this.phraseNotes.push({ note, duration: mainNoteDuration });
    } else {
      this.phraseNotes.push({ note, duration: this.musicTheory.quantizeDuration(rhythmValue) });
    }
  }

  buildPhrase() {
    this.currentBeat = 0;
    this.phraseNotes = [];

    while (this.currentBeat < 2) {
      const rhythmValue = this.rhythmPattern[this.rhythmIndex % this.rhythmPattern.length];
      let note = this.noteSelector.selectNote(this.chordTones, this.scaleNotes, this.phraseNotes, this.currentBeat);

      note += "4"; // Add octave number for proper pitch

      this.addNoteWithApproach(note, rhythmValue);

      this.currentBeat += rhythmValue;
      this.rhythmIndex++;
    }

    this.ensureDurationLimit(this.phraseNotes);

    return this;
  }

  private ensureDurationLimit(phraseNotes: { note: string; duration: number }[]) {
    while (phraseNotes.reduce((sum, n) => sum + n.duration, 0) > 2) {
      const lastNote = phraseNotes[phraseNotes.length - 1];
      lastNote.duration = Math.max(0.25, lastNote.duration - 0.25);
    }
  }

  /**
   * Add a variation to the phrase, such as a longer note or a flourish.
   */
  public addPhraseVariation() {
    const lastNote = this.phraseNotes[this.phraseNotes.length - 1];
    if (Math.random() < 0.5) {
      // Double the duration of the last note
      lastNote.duration = Math.min(lastNote.duration * 2, 2 - this.currentBeat);
    } else {
      // Add a flourish to the end of the phrase
      const remainingTime = 2 - this.currentBeat;
      if (remainingTime >= 0.5) {
        const flourish = [
          {
            note: `${this.scaleNotes[(this.scaleNotes.indexOf(lastNote.note[0]) + 1) % 7]}4`,
            duration: 0.25,
          },
          {
            note: `${this.scaleNotes[(this.scaleNotes.indexOf(lastNote.note[0]) + 2) % 7]}4`,
            duration: 0.25,
          },
        ];
        this.phraseNotes.pop(); // Remove the last note
        this.phraseNotes.push(...flourish);
      }
    }

    return this;
  }

  build() {
    return this.phraseNotes;
  }
}
