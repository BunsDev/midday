import * as Midi from "@tonejs/midi";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Card, CardContent } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { chordToNotes, generateCatchyMelody, getRandomItem } from "~/helpers/music";
import { AudioPlayer, type PlaybackType } from "~/lib/AudioPlayer";
import { type Chord, EMOTION_CHORDS, type Emotion } from "../lib/constants";

export const meta: MetaFunction = () => {
  return [{ title: "Midday - MIDI Generator" }, { name: "Midday", content: "Generate MIDI melodies" }];
};

export default function Index() {
  const [emotion, setEmotion] = useState<Emotion>("euphoric");
  const [chordProgression, setChordProgression] = useState<Chord[]>([]);
  const [melody, setMelody] = useState<{ note: string; duration: number }[]>([]);
  const [playbackType, setPlaybackType] = useState<PlaybackType>("both");
  const audioPlayerRef = useRef<AudioPlayer>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer();
    return () => {
      audioPlayerRef.current?.dispose();
    };
  }, []);

  const generateChordProgression = () => {
    audioPlayerRef.current?.stopAudio();
    setIsPlaying(false);

    const chord = EMOTION_CHORDS[emotion];
    const newProgression = getRandomItem(chord as string[][]) as Chord[];
    setChordProgression(newProgression);
    setMelody(generateCatchyMelody(newProgression));
  };

  const regenerateMelody = () => {
    audioPlayerRef.current?.stopAudio();
    setIsPlaying(false);

    if (chordProgression.length > 0) {
      setMelody(generateCatchyMelody(chordProgression));
    }
  };

  const playAudio = async () => {
    if (!audioPlayerRef.current) return;

    if (isPlaying) {
      setIsPlaying(audioPlayerRef.current.stopAudio());
      return;
    }

    setIsPlaying(true);
    await audioPlayerRef.current.playAudio(chordProgression, melody, playbackType, isPlaying).then(() => {
      setIsPlaying(false);
    });
  };

  const downloadMIDI = () => {
    const midi = new Midi.Midi();
    const chordTrack = midi.addTrack();
    const melodyTrack = midi.addTrack();

    // Add chord progression (played twice)
    for (let repeat = 0; repeat < 2; repeat++) {
      chordProgression.forEach((chord, index) => {
        const chordNotes = chordToNotes(chord);

        for (const note of chordNotes) {
          chordTrack.addNote({
            midi: Tone.Frequency(note).toMidi(),
            time: repeat * 8 + index * 2,
            duration: 2,
          });
        }
      });
    }

    // Add melody
    let melodyTime = 0;
    for (const { note, duration } of melody) {
      melodyTrack.addNote({
        midi: Tone.Frequency(note).toMidi(),
        time: melodyTime,
        duration: duration,
      });
      melodyTime += duration;
    }

    const blob = new Blob([midi.toArray()], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `melody-${emotion}-${Date.now()}.mid`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-6">Midday - MIDI Generator</h1>
      <div className="flex justify-center text-center mb-6">
        This tool generates a chord progression and a catchy melody based on the selected emotion. You can play the audio and download the melody as a
        MIDI file.
        <br />
        This is not using AI or machine learning, but it's based on music theory principles and random generation. There are often wrong notes or
        dissonances in the generated melodies, but that's part of the fun!
        <br />
        Play around and maybe a spark of inspiration will come to you!
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6">Melody Generator</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="emotion" className="block text-sm font-medium text-gray-700 mb-1">
                Select Emotion:
              </label>
              <Select value={emotion} onValueChange={(v) => setEmotion(v as Emotion)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an emotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="euphoric">Euphoric</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sorrow">Sorrow</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="joyful">Joyful</SelectItem>
                  <SelectItem value="creepy">Creepy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateChordProgression} className="w-full">
              Generate Chord Progression
            </Button>
            <Button onClick={regenerateMelody} className="w-full">
              Regenerate Melody
            </Button>
            {chordProgression.length > 0 && (
              <div className="space-y-4">
                <p className="text-lg">Chord Progression: {chordProgression.join(" - ")} (played twice)</p>
                <p className="text-lg">Melody: {melody.map(({ note }) => `${note}`).join(", ")}</p>
                <div className="flex space-x-2">
                  <Button onClick={playAudio} className="flex-1">
                    {isPlaying ? "Stop" : "Play"}
                  </Button>
                  <Select value={playbackType} onValueChange={(val) => setPlaybackType(val as PlaybackType)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select playback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="chords">Chords Only</SelectItem>
                      <SelectItem value="melody">Melody Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={downloadMIDI} className="w-full">
                  Download MIDI
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center mt-6">
        <div className="text-center mb-4">
          This project is free to use and{" "}
          <a className="text-blue-500" target="_blank" href="https://example.com" rel="noreferrer">
            open-source
          </a>
          <br />
          If you find it helpful or entertaining, consider supporting me ❤
        </div>
        <a href="https://www.buymeacoffee.com/meienbergerdev" target="_blank" rel="noreferrer">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{ height: "60px", width: "217px" }} />
        </a>
      </div>
    </div>
  );
}
