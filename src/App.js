import './App.css';
import PitchDetector from "./PitchDetector";
import { NoteProvider } from "./NoteContext";
import { QuestionProvider } from './QuestionContext';
import Question from './Question';

const App = () => {
  return (
    <div className='app'>
      <QuestionProvider>
          <NoteProvider>
            <Question />
            <PitchDetector />
          </NoteProvider>
      </QuestionProvider>
    </div>
  );
};

export default App;
