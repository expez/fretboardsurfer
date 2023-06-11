import React, { createContext, useContext, useReducer } from "react";

const QuestionContext = createContext();
const QuestionDispatchContext = createContext();

const notes = [
    "A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"
];
const stringPositions = ["U", "M", "L"];

const getRandomNote = () => {
  return notes[Math.floor(Math.random() * notes.length)];
};

const generateNotes = () => {
  const randomNotes = [];
  for (let i = 0; i < 10; i++) {
    const randomNote = getRandomNote();
    randomNotes.push(randomNote);
  }
  return randomNotes;
};

const makeQuestion = (fretboardPosition, stringPosition, randomNotes) => {
    return {
        noteNames: randomNotes,
        fretboardPosition: fretboardPosition,
        stringPosition: stringPosition,
        createdAt: Date.now()
    }
}

const generateQuestion = () => {
    const randomNotes = generateNotes();
    const fretboardPosition = Math.floor(Math.random() * 10);
    const stringPosition = stringPositions[Math.floor(Math.random() * stringPositions.length)];
    return makeQuestion(fretboardPosition, stringPosition, randomNotes)
};

const initialState = generateQuestion();

const answerQuestion = (noteNames) => {
  const newNote = getRandomNote();
  noteNames.shift();
  noteNames.push(newNote);
  return noteNames;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GENERATE_QUESTION":
      return generateQuestion();
    case "ANSWER_QUESTION":
      return {
        ...state,
        createdAt: Date.now(),
        noteNames: answerQuestion(state.noteNames)
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const QuestionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <QuestionContext.Provider value={state}>
            <QuestionDispatchContext.Provider value={dispatch}>
                {children}
            </QuestionDispatchContext.Provider>
        </QuestionContext.Provider>
    );
};

const useQuestion = () => {
    const context = useContext(QuestionContext);
    if (context === undefined) {
        throw new Error("useQuestion must be used within a QuestionProvider");
    }
    return context;
};

const useQuestionDispatch = () => {
    const context = useContext(QuestionDispatchContext);
    if (context === undefined) {
        throw new Error("useQuestionDispatch must be used within a QuestionProvider");
    }
    return context;
};

const generateNewQuestion = () => {
    return { type: "GENERATE_QUESTION" }
};

export { QuestionProvider, useQuestion, useQuestionDispatch };