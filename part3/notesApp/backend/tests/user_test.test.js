const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const User = require("../models/users");
const helper = require("./testHelper");

const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");

const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await Promise.all(
    helper.initialUsers.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        username: user.username,
        name: user.name,
        passwordHash,
      });
      await newUser.save();
    })
  );
});

describe("GET requests for Users API", () => {
  test("users are returned as JSON", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.length, 2);
  });
});

describe("POST requests for Users API", () => {
  test("Post request with valid details", async () => {
    const newUser = {
      name: "harun",
      username: "harunf1",
      password: "harunf098",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("test fails with creating  existing username", async () => {
    const newUser = {
      name: "harun",
      username: "testuser1",
      password: "dummy",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
  });
});
after(async () => {
  await mongoose.connection.close();
});
