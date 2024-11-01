import * as Tone from "tone";
import { chordToNotes, createPiano } from "~/helpers/music";
import type { Chord } from "./constants";

export type PlaybackType = "both" | "chords" | "melody";

export class AudioPlayer {
  private synth: Tone.Sampler;
  private timeoutRef: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.synth = createPiano();
  }

  public dispose() {
    this.synth.dispose();
  }

  public stopAudio() {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();

    this.synth.releaseAll();

    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }

    return false;
  }

  public async playAudio(chordProgression: Chord[], melody: { note: string; duration: number }[], playbackType: PlaybackType, isPlaying: boolean) {
    if (isPlaying) {
      return this.stopAudio();
    }

    await Tone.start();

    const chordsNotes: { note: string[]; time: number }[] = [];
    if (playbackType === "chords" || playbackType === "both") {
      for (let repeat = 0; repeat < 2; repeat++) {
        chordProgression.forEach((chord, index) => {
          const chordNotes = chordToNotes(chord);
          const time = repeat * 8 + index * 2;
          chordsNotes.push({ note: chordNotes, time });
        });
      }
    }

    const melodyNotes: { note: string; time: number; duration: number }[] = [];
    if (playbackType === "melody" || playbackType === "both") {
      let melodyTime = 0;

      for (const { note, duration } of melody) {
        melodyNotes.push({ note, time: melodyTime, duration });
        melodyTime += Tone.Time(duration).toSeconds();
      }
    }

    Tone.loaded().then(() => {
      new Tone.Part((time, value) => {
        this.synth.triggerAttackRelease(value.note, "1n", time);
      }, chordsNotes).start(0);

      new Tone.Part((time, value) => {
        this.synth.triggerAttackRelease(value.note, value.duration, time);
      }, melodyNotes).start(0);

      Tone.getTransport().start();
    });

    // Set the Transport to stop after playing
    const duration = 16; // 16 seconds for 8 bars
    this.timeoutRef = setTimeout(() => {
      this.stopAudio();
    }, duration * 1000);

    return new Promise<boolean>((resolve) => {
      Tone.getTransport().on("stop", () => {
        resolve(false);
      });
    });
  }
}
