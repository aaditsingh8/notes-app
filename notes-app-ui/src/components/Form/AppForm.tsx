import React from "react";
import { GlobalContext } from "App";
import { Note } from "types";
import './styles.css'

function AppForm() {
    const { notesState, titleState, contentState, selectedNoteState } = React.useContext(GlobalContext)
    const [notes, setNotes] = notesState;
    const [title, setTitle] = titleState;
    const [content, setContent] = contentState;
    const [selectedNote, setSelectedNote] = selectedNoteState;

    const handleAddNoteButton = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:6001/api/notes/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            );
            const responseObj = await response.json();
            const newNote: Note = responseObj.note;

            setNotes([newNote, ...notes]);  // add note to the beginning
            setTitle("");                   // reset title input box
            setContent("");                 // reset content input box
        } catch (e) {
            console.log(e);
        }
    };

    const handleUpdateNote = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedNote) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:6001/api/notes/update/${selectedNote.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            );
            const responseObj = await response.json();
            const updatedNote: Note = responseObj.note;

            const updatedNotesList = notes.map((note) =>
                note.id === selectedNote.id
                    ? updatedNote
                    : note
            );

            setNotes(updatedNotesList);
            setTitle("");
            setContent("");
            setSelectedNote(null);
        } catch (e) {
            console.log(e);
        }
    };

    const handleCancelNote = () => {
        setTitle("");
        setContent("");
        setSelectedNote(null);
    };

    return (
        <form
            className="note-form"
            onSubmit={(event) =>
                selectedNote
                    ? handleUpdateNote(event)
                    : handleAddNoteButton(event)
            }
        >
            <input
                placeholder="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={10}
                required
            />
            {selectedNote ? (
                <div className="edit-buttons">
                    <button type="submit">Save</button>
                    <button onClick={handleCancelNote}>Cancel</button>
                </div>
            ) : (
                <button type="submit">Add Note</button>
            )}
        </form>
    );
}

export default AppForm;