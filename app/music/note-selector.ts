import { getRandomItem } from "../helpers/music";

const CHORD_TONE_PROBABILITY = 0.6;
const SCALE_NOTE_PROBABILITY = 0.3;

export class NoteSelector {
  constructor(
    private previousNote: string | null,
    private direction: number,
  ) {}

  /**
   * This method selects the next note in the melody.
   * It uses the previous note and the current beat to determine the next note.
   *
   * @param chordTones
   * @param scaleNotes
   * @param phraseNotes
   * @param currentBeat
   * @returns
   */
  public selectNote(chordTones: string[], scaleNotes: string[], phraseNotes: { note: string; duration: number }[], currentBeat: number): string {
    let note: string;

    if (currentBeat === 0 || !this.previousNote) {
      // Start with a chord tone
      note = getRandomItem(chordTones);
    } else {
      const lastNote = phraseNotes[phraseNotes.length - 1]?.note.replace(/\d+$/, "") || this.previousNote;
      const lastNoteIndex = scaleNotes.indexOf(lastNote);

      // Use chord tones more frequently
      if (Math.random() < CHORD_TONE_PROBABILITY) {
        note = getRandomItem(chordTones);
      } else if (Math.random() < SCALE_NOTE_PROBABILITY) {
        // Use scale notes less frequently
        note = getRandomItem(scaleNotes);
      } else {
        // Use passing or neighbor tones
        note = scaleNotes[(lastNoteIndex + this.direction + 7) % 7];
      }
    }

    this.applyVoiceLeading(scaleNotes, note);
    return note;
  }

  /**
   * This method applies voice leading to the selected note.
   * Voice leading is the practice of moving from one chord to another by changing as few notes as possible.
   * This method ensures that the melody notes are close to the previous note.
   *
   * @param scaleNotes
   * @param note
   */
  private applyVoiceLeading(scaleNotes: string[], note: string) {
    let adjustedNote = note;

    if (this.previousNote) {
      const currentIndex = scaleNotes.indexOf(note);
      const previousIndex = scaleNotes.indexOf(this.previousNote.replace(/\d+$/, ""));

      if (Math.abs(currentIndex - previousIndex) > 2) {
        adjustedNote = scaleNotes[(previousIndex + this.direction + 7) % 7];
      }

      if (currentIndex === 6 || currentIndex === 0) {
        this.direction *= -1;
      }
    }

    this.previousNote = adjustedNote;
  }
}
