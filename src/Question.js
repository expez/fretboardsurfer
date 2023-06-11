import React from "react";
import { useQuestion } from "./QuestionContext";

const Question = () => {
  const question = useQuestion();

  return (
    <div>
      <p>{question.fretboardPosition}{question.stringPosition}: {question.noteNames[0]}</p>
    </div>
  );
};

export default Question;