import React from 'react';
import { useState, useEffect } from 'react';
import { Note, GlobalState } from 'types';
import { AppForm, AppNotesList } from 'components';
import './App.css';

export const GlobalContext = React.createContext<GlobalState>({
  notesState: [[], () => { }],
  titleState: ["", () => { }],
  contentState: ["", () => { }],
  selectedNoteState: [null, () => { }],
});

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const globalContextValue: GlobalState = {
    notesState: [notes, setNotes],
    titleState: [title, setTitle],
    contentState: [content, setContent],
    selectedNoteState: [selectedNote, setSelectedNote]
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

  return (
    <div className="app-container">
      <GlobalContext.Provider value={globalContextValue} >
        <AppForm />
        <AppNotesList />
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
