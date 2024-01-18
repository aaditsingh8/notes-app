import React from 'react';
import { useState, useEffect } from 'react';
import { Note, GlobalState } from 'types';
import { AppForm } from 'components';
import './App.css';

export const GlobalContext = React.createContext<GlobalState>({
  notesState: [ [], () => {} ],
  titleState: [ "", () => {} ],
  contentState: [ "", () => {} ],
  selectedNoteState: [ null, () => {} ],
});

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const globalContextValue: GlobalState = {
    notesState: [ notes, setNotes ],
    titleState: [ title, setTitle ],
    contentState: [ content, setContent ],
    selectedNoteState: [ selectedNote, setSelectedNote ]
  };

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
    <div className="app-container">
      <GlobalContext.Provider value={globalContextValue} >
        <AppForm />
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
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
