import React, { useEffect, useState } from "react";
import * as Pitchfinder from "pitchfinder";
import { useNoteDispatch, updateFrequency, useNote } from "./NoteContext";

const PitchDetector = () => {
  const noteDispatch = useNoteDispatch();
  const note = useNote();
  const [error, setError] = useState(null);

  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    const calculateRMS = (buffer) => {
      let rms = 0;
      for (let i = 0; i < buffer.length; i++) {
        rms += buffer[i] ** 2;
      }
      rms = Math.sqrt(rms / buffer.length);
      return rms;
    };

    const updatePitch = (analyserNode, detector) => {
      const bufferLength = 4096;
      const float32Array = new Float32Array(bufferLength);
      analyserNode.getFloatTimeDomainData(float32Array);

      const rms = calculateRMS(float32Array);

      // Only update the pitch if the RMS is above a certain threshold
      if (rms > 0.11) {
        const detectPitch = Pitchfinder.YIN({ sampleRate: audioContext.sampleRate, probabilityThreshold: 0.9 });
        const pitch = detectPitch(float32Array);

        if (pitch !== null) {
          noteDispatch(updateFrequency(pitch));
        }
      }

      window.requestAnimationFrame(() => updatePitch(analyserNode, detector));
    };

    const handleStream = (stream) => {
      audioContext.createMediaStreamSource(stream).connect(analyserNode);
      updatePitch(analyserNode);
    };

    const handleResume = () => {
      audioContext.resume();
    };

    document
      .getElementById("resume-button")
      .addEventListener("click", handleResume);

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleStream)
      .catch((_) => {
        setError("Error: Could not get audio stream from microphone");
      });

    return () => {
      document
        .getElementById("resume-button")
        .removeEventListener("click", handleResume);
    };
  }, [noteDispatch]);

  return (
    <div>
      {error && <div>{error}</div>}
      {!error && (
        <>
          Note name: <span>{note.name}</span>
          <button id="resume-button">Resume</button>
        </>
      )}
    </div>
  );
};

export default PitchDetector;