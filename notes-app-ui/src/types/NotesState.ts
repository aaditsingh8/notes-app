import { createContext } from "react";
import Note from "./Note"

type NotesState = {
    notes: Note[],
    setNotes: (n: Note[]) => void
};

export default NotesState;