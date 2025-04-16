import React, { useState } from "react";
import Note from "./Note";

const NotesList = ({ notes, toggleImportanceOf, removeThisNote }) => {
  const [showAll, setShowAll] = useState(false);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            removeNote={() => removeThisNote(note.id)}
          />
        ))}
      </ul>

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "important" : "all"}
      </button>
    </div>
  );
};

export default NotesList;
