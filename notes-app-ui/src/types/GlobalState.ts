import Note from "./Note"

type GlobalState = {
    notesState: [
        notes: Note[],
        setNotes: (n: Note[]) => void
    ],
    titleState: [
        title: string,
        setTitle: (t: string) => void
    ],
    contentState: [
        content: string,
        setContent: (c: string) => void
    ],
    selectedNoteState: [
        selectedNote: Note | null,
        setSelectedNote: (s: Note | null) => void
    ]
};

export default GlobalState;