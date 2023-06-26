import React, { useEffect, useState } from "react";
import * as Pitchfinder from "pitchfinder";
import { useNoteDispatch, updateFrequency } from "./NoteContext";
import { useQuestionDispatch, useQuestion, correctAnswer, wrongAnswer, isCorrect} from "./QuestionContext";
import * as Tone from 'tone'

const getNoteName = (frequency) => {
    const noteName = Tone.Frequency(frequency).toNote().replace(/\d/g, '');
    return noteName;
}

const PitchDetector = () => {
  const noteDispatch = useNoteDispatch();
  const [error, setError] = useState(null);
  const question = useQuestion();
  const questionDispatch = useQuestionDispatch();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [inputDeviceName, setinputDeviceName] = useState(null);

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
      if(!inputDeviceName) {
          navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            const audioDevice = devices.find((device) => device.deviceId === stream.getAudioTracks()[0].getSettings().deviceId);
            if (audioDevice) {
              setinputDeviceName(audioDevice.label);
            }
          })
          .catch((_) => {
            console.log("Error: Could not enumerate audio devices");
          });
        }
    };

    const handleGo = () => {
      audioContext.resume();
      console.log("inputDeviceName", inputDeviceName);
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