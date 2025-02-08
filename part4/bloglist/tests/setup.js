const supertest = require("supertest");
const app = require("../app");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

module.exports = async function globalSetup() {
  // Clear out any existing users to start fresh
  await User.deleteMany({});

  // Create a new test user
  const newUser = { username: "testuser", password: "password123" };
  const userResponse = await supertest(app).post("/api/users").send(newUser);

  // Prepare the user for the JWT payload
  const userForToken = {
    username: userResponse.body.username,
    id: userResponse.body.id,
  };

  // Sign the JWT with the secret from config
  const token = jwt.sign(userForToken, config.JWT_SECRET, { expiresIn: "1h" });

  return token;
};
