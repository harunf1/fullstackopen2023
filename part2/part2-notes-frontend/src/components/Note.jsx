const Note = ({ note, toggleImportance, removeNote }) => {
  const label = note.important ? "Make Un-important" : "Make important";

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={removeNote}>delete</button>
    </li>
  );
};

export default Note;
