import './App.css';
import PitchDetector from "./PitchDetector";
import { NoteProvider } from "./NoteContext";
import { QuestionProvider } from './QuestionContext';
import Question from './Question';

const App = () => {
  return (
    <div>
      <QuestionProvider>
        <NoteProvider>
          <h1>Fretboard surfer</h1>
          <Question/>
          <PitchDetector />
        </NoteProvider>
      </QuestionProvider>
    </div>
  );
};

export default App;
