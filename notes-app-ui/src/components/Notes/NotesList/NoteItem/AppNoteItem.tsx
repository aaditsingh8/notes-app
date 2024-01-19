import React from "react";
import { GlobalContext } from "App";
import { Note } from "types";
import './styles.css'

interface AppNoteItemProps {
    note: Note
};

function AppNoteItem({ note }: AppNoteItemProps) {
    const { notesState, titleState, contentState, selectedNoteState } = React.useContext(GlobalContext)
    const [notes, setNotes] = notesState;
    const setTitle = titleState[1];
    const setContent = contentState[1];
    const setSelectedNote = selectedNoteState[1];

    const handleNoteSelection = (note: Note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const handleDeleteNote = async (
        event: React.MouseEvent,
        notedId: number
    ) => {
        event.stopPropagation();

        try {
            await fetch(
                `http://localhost:6001/api/notes/delete/${notedId}`,
                {
                    method: "DELETE"
                }
            );

            const filteredNotesList = notes.filter(
                (note) => note.id !== notedId
            );

            setNotes(filteredNotesList);
        } catch (e) {
            console.log(e);
        }

    };

    return (
        <div
            className="note-item"
            onClick={() => handleNoteSelection(note)}
        >
            <div className="notes-header">
                <button
                    onClick={(event) =>
                        handleDeleteNote(event, note.id)
                    }
                >x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
        </div>
    );
}

export default AppNoteItem;