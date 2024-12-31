const jwt = require("jsonwebtoken");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const loginRouter = require("express").Router();

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  if (!user) {
    return response.status(401).json({ error: "cannot find user" });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return response.status(401).json({ error: "Incorrect pwd" });
  }

  const useForToken = { username: user.username, id: user._id };
  const token = jwt.sign(useForToken, JWT_SECRET, { expiresIn: 60 * 60 });

  response.status(200).send({ token, user: user.username, name: user.name });
});
module.exports = loginRouter;
