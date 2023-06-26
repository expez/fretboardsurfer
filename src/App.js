import './App.css';
import PitchDetector from "./PitchDetector";
import { NoteProvider } from "./NoteContext";
import { QuestionProvider } from './QuestionContext';
import Question from './Question';
import React, { useState, useEffect } from "react";

const App = () => {
 const [micPermission, setMicPermission] = useState(false);

 useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setMicPermission(true))
      .catch(() => setMicPermission(false));
  }, []);

  if (!micPermission) {
    return (
      <div className="app">
        <div className="error-message">Microphone permission not granted.</div>
      </div>
    );
  }

  return (
    <div className='app'>
      <QuestionProvider>
          <NoteProvider>
            <Question/>
            <PitchDetector/>
          </NoteProvider>
      </QuestionProvider>
    </div>
  );
};

export default App;
