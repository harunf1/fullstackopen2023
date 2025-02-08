const bcrypt = require("bcrypt");
const User = require("../models/users");
const mongoose = require("mongoose");
const helper = require("./userTestHelper");
const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const globalSetup = require("./setup");
// importing our entire http server and passing it to supertest
const app = require("../app");
const { globalAgent } = require("node:http");
const api = supertest(app);

let token;
test.before(async () => {
  token = await globalSetup();
});

// test suite starts with describe:

describe("TEST SUITE FOR USERS ", () => {
  test("creation succeeds with new username", async () => {
    const start = await helper.usersInDb();
    const newUser = {
      username: "harunf1",
      name: "harun",
      password: "qwerty",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("content-type", /application\/json/);

    const end = await helper.usersInDb();
    assert.strictEqual(end.length, start.length + 1);

    const usernames = end.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("rejection of new user with non unique username", async () => {
    const start = await helper.usersInDb();
    const newUser = {
      username: "root",
      name: "tester",
      password: "adamsmith123",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("content-type", /application\/json/);

    const end = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));
    assert.strictEqual(end.length, start.length);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
