const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/users");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!password) {
    return response.status(401).json({ error: "You need to provide a pwd" });
  }
  const salting = 10;
  const passwordHash = await bcrypt.hash(password, salting);

  const user = new User({
    username,
    name,
    passwordHash,
  });
  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

module.exports = usersRouter;
