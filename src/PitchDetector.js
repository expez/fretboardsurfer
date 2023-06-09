import React, { useEffect, useRef } from "react";
import * as Pitchfinder from "pitchfinder";

const PitchDetector = () => {
  const pitchRef = useRef(null);
  const clarityRef = useRef(null);

  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    const updatePitch = (analyserNode, detector) => {
      const bufferLength = 4096;
      const float32Array = new Float32Array(bufferLength);

      analyserNode.getFloatTimeDomainData(float32Array);

      const detectPitch = Pitchfinder.YIN({sampleRate: audioContext.sampleRate});
      const pitch = detectPitch(float32Array); // null if pitch cannot be identified

      if (pitch !== null) {
        pitchRef.current.textContent = `${Math.round(pitch)} Hz`;
        clarityRef.current.textContent = "Pitch detected";
      } else {
        pitchRef.current.textContent = "No pitch detected";
        clarityRef.current.textContent = "";
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

    navigator.mediaDevices.getUserMedia({ audio: true }).then(handleStream);

    return () => {
      // Cleanup code, remove event listeners or perform any necessary cleanup.
      document
        .getElementById("resume-button")
        .removeEventListener("click", handleResume);
    };
  }, []);

  return (
    <div>
      <div>
        Pitch: <span id="pitch" ref={pitchRef}></span>
      </div>
      <div>
        <span id="clarity" ref={clarityRef}></span>
      </div>
      <button id="resume-button">Resume</button>
    </div>
  );
};

export default PitchDetector;