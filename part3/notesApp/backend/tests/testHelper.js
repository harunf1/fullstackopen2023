const Note = require("../models/notes");
const User = require("../models/users");

const initialNotes = [
  { content: "HTML is easy", important: false },
  { content: "Browser can execute only JavaScript", important: true },
];

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const initialUsers = [
  { username: "testuser1", name: "Test User One", password: "password123" },
  { username: "testuser2", name: "Test User Two", password: "password456" },
];

module.exports = {
  initialNotes,
  notesInDb,
  initialUsers,
  usersInDb,
};
