import logo from './logo.svg';
import './App.css';
import PitchDetector from "./PitchDetector";

const App = () => {
  return (
    <div>
      <h1>React Pitch Detector</h1>
      <PitchDetector />
    </div>
  );
};


/* function app() {
  return (
    <div classname="app">
      <header classname="app-header">
        <img src={logo} classname="app-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
} */

export default App;
