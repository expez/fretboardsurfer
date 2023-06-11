import React from "react";
import { useQuestion } from "./QuestionContext";

const Question = () => {
    const question = useQuestion();
    const numberOfNotes = 1;

    return (
        <div className="question">
            <div className="hand-position-container">
                <p className="hand-position">
                    <span className="fret-position">{question.fretboardPosition}</span>
                    <span className="string-position">{question.stringPosition}</span></p>
            </div>
            <p className="note-names">{question.noteNames.slice(0, numberOfNotes).join(", ")}</p>
        </div>
    );
};

export default Question;