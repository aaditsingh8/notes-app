import React from 'react';
import { useState, useEffect } from 'react';
import { Note, NotesState } from 'types';
import './App.css';

const NotesContext = React.createContext<NotesState>({
  notes: [],
  setNotes: () => {}
});

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // populate notes on landing
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:6001/api/notes/list");
        const notes: Note[] = await response.json();
        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotes();
  }, []);

  
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

  const handleNoteSelection = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
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
    <div className="app-container">
      <NotesContext.Provider value={{ notes: notes, setNotes: setNotes }} >
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
        <div className="notes-grid">
          {notes.map((note) => (
            <div
              className="note-item"
              onClick={() => handleNoteSelection(note)}
              key={note.id}>
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
          ))}
        </div>
      </NotesContext.Provider>
    </div>
  );
}

export default App;
