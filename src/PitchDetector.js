import React, { useEffect, useState } from "react";
import * as Pitchfinder from "pitchfinder";
import { useNoteDispatch, updateFrequency } from "./NoteContext";
import { useQuestionDispatch, useQuestion, correctAnswer, wrongAnswer} from "./QuestionContext";
import * as Tone from 'tone'

const getNoteName = (frequency) => {
    const noteName = Tone.Frequency(frequency).toNote().replace(/\d/g, '');
    return noteName;
}

const isEnharmonic = (noteName1, noteName2) => {
    const enharmonicNotes = {
        'C#': 'Db',
        'Db': 'C#',
        'D#': 'Eb',
        'Eb': 'D#',
        'F#': 'Gb',
        'Gb': 'F#',
        'G#': 'Ab',
        'Ab': 'G#',
        'A#': 'Bb',
        'Bb': 'A#',
    };
    return enharmonicNotes[noteName1] === noteName2;
}

const isCorrect = (question, answer) => {
  const correctAnswer = question.noteNames[0];
  console.log(correctAnswer, answer);
    return correctAnswer === answer || isEnharmonic(correctAnswer, answer);
};

const PitchDetector = () => {
  const noteDispatch = useNoteDispatch();
  const [error, setError] = useState(null);
  const question = useQuestion();
  const questionDispatch = useQuestionDispatch();
  const [buttonClicked, setButtonClicked] = useState(false);

    const calculateRMS = (buffer) => {
      let rms = 0;
      for (let i = 0; i < buffer.length; i++) {
        rms += buffer[i] ** 2;
      }
      rms = Math.sqrt(rms / buffer.length);
      return rms;
    };

    const calculateBufferLength = (sampleRate) => {
      const baseBufferLength = 4096;
      const baseSampleRate = 44100;
      const bufferLength = Math.round((sampleRate / baseSampleRate) * baseBufferLength);
      return bufferLength;
    };


  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    const updatePitch = (analyserNode, detector) => {
      const sampleRate = audioContext.sampleRate;
      const bufferLength = calculateBufferLength(sampleRate);
      const float32Array = new Float32Array(bufferLength);

      analyserNode.getFloatTimeDomainData(float32Array);

      const rms = calculateRMS(float32Array);

      if (rms > 0.11) {
        const detectPitch = Pitchfinder.YIN({ sampleRate: sampleRate, probabilityThreshold: 0.9 });
        const pitch = detectPitch(float32Array);

        if (pitch !== null) {
          noteDispatch(updateFrequency(pitch));
          const noteName = getNoteName(pitch);
          if (isCorrect(question, noteName)) {
            questionDispatch(correctAnswer());
          } else {
            questionDispatch(wrongAnswer());
          }
        }
      }

      window.requestAnimationFrame(() => updatePitch(analyserNode, detector));
    };

    const handleStream = (stream) => {
      audioContext.createMediaStreamSource(stream).connect(analyserNode);
      updatePitch(analyserNode);
    };

    const handleGo = () => {
      audioContext.resume();
      setButtonClicked(true);
    };

    const addGoButtonListener = () => {
      const button = document.getElementById("go-button");
      if (button) {
        button.addEventListener("click", handleGo);
      }
    };

    const removeGoButtonListener = () => {
      const button = document.getElementById("go-button");
      if (button) {
        button.removeEventListener("click", handleGo);
      }
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleStream)
      .catch((_) => {
        setError("Error: Could not get audio stream from microphone");
      });

    addGoButtonListener();

    return removeGoButtonListener;
  });

  return (
    <div>
        {error && <div>{error}</div>}
        {!error && !buttonClicked && (
          <>
            <button id="go-button" className="go-button" >Go</button>
          </>
      )}
    </div>
  );
};

export default PitchDetector;