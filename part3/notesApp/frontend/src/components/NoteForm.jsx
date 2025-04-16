import { useState } from "react";

const NoteForm = ({ addnote }) => {
  const [newNote, setNewNote] = useState("");
  const sumbitHandle = (event) => {
    event.preventDefault();
    addnote(newNote);
    setNewNote("");
  };
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };
  return (
    <div>
      <form onSubmit={sumbitHandle}>
        add Note<br></br>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default NoteForm;
