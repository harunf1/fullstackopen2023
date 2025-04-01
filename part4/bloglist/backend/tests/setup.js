const supertest = require("supertest");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const Blogs = require("../models/blogs");

module.exports = async function globalSetup() {
  // Clear the test database
  await User.deleteMany({});
  await Blogs.deleteMany({});

  // Create a unique test user
  const uniqueUsername = `testuser_${Date.now()}`; // Use a timestamp to ensure uniqueness
  const newUser = {
    name: "testuser",
    username: uniqueUsername,
    password: "password123",
  };

  // Save the new user to the database
  const savedUser = await new User(newUser).save();

  // Generate JWT token for the saved user
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  const token = jwt.sign(userForToken, config.JWT_SECRET, { expiresIn: "1h" });

  // Initialize blogs for the new user
  const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      user: savedUser._id,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      user: savedUser._id,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      user: savedUser._id,
    },
  ];

  await Blogs.insertMany(initialBlogs);

  return { newUser: savedUser, token };
};
