import React from "react";
import { GlobalContext } from "App";
import AppNoteItem from "./NoteItem";
import './styles.css'

function AppNotesList() {
    const { notesState } = React.useContext(GlobalContext)
    const notes = notesState[0];

    return (
        <div className="notes-grid">
            {notes.map((note) => (
                <AppNoteItem
                    note={note}
                    key={note.id}
                />
            ))}
        </div>
    );
}

export default AppNotesList;