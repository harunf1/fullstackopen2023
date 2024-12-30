// importing the express route maker & My mongodb model to from notes
const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const Note = require("../models/notes");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

const getTokenFrom = (request) => {
  const auth = request.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
  return null;
};

//GET ALL NOTES
notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});
//GET SPECIFIC NOTE
notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// POST REQUEST
notesRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodeToken = jwt.verify(getTokenFrom(request), JWT_SECRET);
  if (!decodeToken) {
    response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodeToken.id);

  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });
  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedNote);
});

//DELETE REQUEST
notesRouter.delete("/:id", async (request, response) => {
  const result = await Note.findByIdAndDelete(request.params.id);

  if (result) {
    response.status(204).end();
  } else {
    response.status(404).send({ error: "Note not found" });
  }
});

//PUT REQUEST (UPDATE)

notesRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { important } = request.body;

  if (typeof important !== "boolean") {
    return response.status(400).json({ error: "important feild reuired" });
  }

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { important },
    { new: true, runValidators: true, context: "query" }
  );
  if (!updatedNote) {
    return response.status(404).json({ error: "Note not found" });
  }
  response.json(updatedNote);
});

module.exports = notesRouter;
