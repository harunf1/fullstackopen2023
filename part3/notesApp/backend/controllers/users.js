// importing the express route maker & My mongodb model to from notes
const usersRouter = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");

//GET for users
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    important: 1,
  });

  response.json(users);
});
//POST new User

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, username, passwordHash });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.delete("/:id", async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id);
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  response.status(204).end();
});

module.exports = usersRouter;
