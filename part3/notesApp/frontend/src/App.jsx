import { useState, useEffect } from "react";
import noteService from "./services/notes";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";
import Togglable from "./components/Togglebale";
import NotesList from "./components/noteList";
import { handleError } from "./helpers/errorHelper";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const updatedNotes = await noteService.getAll();
        setNotes(updatedNotes);
      } catch (exception) {
        handleError(setErrorMessage, exception);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("LoggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
      console.log("user present in local storage");
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      noteService.setToken(user.token);
      window.localStorage.setItem("LoggedNoteappUser", JSON.stringify(user));
    } catch (exception) {
      handleError(setErrorMessage, exception);
    }
  };

  const addNote = async (newNote) => {
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    try {
      const returnedNote = await noteService.create(noteObject);
      setNotes(notes.concat(returnedNote));
    } catch (exception) {
      handleError(setErrorMessage, exception);
    }
  };

  const toggleImportanceOf = async (id) => {
    try {
      const noteToChange = notes.find((n) => n.id === id);
      const updatedNote = await noteService.update(id, {
        ...noteToChange,
        important: !noteToChange.important,
      });
      setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
    } catch (exception) {
      handleError(setErrorMessage, exception);
    }
  };

  const removeThisNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (exception) {
      handleError(setErrorMessage, exception);
    }
  };

  return (
    <div>
      <Notification message={errorMessage}></Notification>

      <h1>Notes</h1>

      {user === null ? (
        <Togglable buttonLabel="Login">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      ) : (
        <Togglable buttonLabel="Add a new Note">
          <NoteForm addnote={addNote} />
        </Togglable>
      )}

      <NotesList
        notes={notes}
        toggleImportanceOf={toggleImportanceOf}
        removeThisNote={removeThisNote}
      />
    </div>
  );
};

export default App;
