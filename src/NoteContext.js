import React, { createContext, useReducer, useContext } from "react";
import * as Tone from 'tone'

const initialState = {
    note: null,
    frequency: null,
};

const getNoteName = (frequency) => {
    const noteName = Tone.Frequency(frequency).toNote().replace(/\d/g, '');
    return noteName;
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_FREQUENCY": {
            const frequency = action.payload;
            return { ...state, frequency: frequency, name: getNoteName(frequency) };
        }
        default:
            throw new Error("Invalid action type " + action.type);
    }
};

export const NoteContext = createContext();
export const NoteDispatchContext = createContext();

export const NoteProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <NoteContext.Provider value={state}>
            <NoteDispatchContext.Provider value={dispatch}>
                {children}
            </NoteDispatchContext.Provider>
        </NoteContext.Provider>
    );
};

export const useNoteDispatch = () => {
    return useContext(NoteDispatchContext);
};

export const useNote = () => {
    return useContext(NoteContext);
};

export const updateFrequency = (frequency) => {
    return {
        type: "SET_FREQUENCY",
        payload: frequency,
    };
}
