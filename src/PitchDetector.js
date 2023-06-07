import React, { useEffect, useRef } from "react";
import { PitchDetector as pitchy} from "https://esm.sh/pitchy@4";

const PitchDetector = () => {
  const pitchRef = useRef(null);
  const clarityRef = useRef(null);

  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    const updatePitch = (analyserNode, detector, input, sampleRate) => {
      analyserNode.getFloatTimeDomainData(input);
      const [pitch, clarity] = detector.findPitch(input, sampleRate);

      pitchRef.current.textContent = `${Math.round(pitch * 10) / 10} Hz`;
      clarityRef.current.textContent = `${Math.round(clarity * 100)} %`;

      window.setTimeout(
        () => updatePitch(analyserNode, detector, input, sampleRate),
        100
      );
    };

    const handleStream = (stream) => {
      audioContext.createMediaStreamSource(stream).connect(analyserNode);
      const detector = pitchy.forFloat32Array(analyserNode.fftSize);
      const input = new Float32Array(detector.inputLength);

      updatePitch(analyserNode, detector, input, audioContext.sampleRate);
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
        Clarity: <span id="clarity" ref={clarityRef}></span>
      </div>
      <button id="resume-button">Resume</button>
    </div>
  );
};

export default PitchDetector;