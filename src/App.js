import './App.css';
import PitchDetector from "./PitchDetector";
import { NoteProvider } from "./NoteContext";

const App = () => {
  return (
    <div>
      <NoteProvider>
        <h1>React Pitch Detector</h1>
        <PitchDetector/>
      </NoteProvider>
    </div>
  );
};

export default App;
