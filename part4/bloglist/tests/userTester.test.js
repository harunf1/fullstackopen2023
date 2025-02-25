const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");

const globalSetup = require("./setup");
const mongoose = require("mongoose");

const supertest = require("supertest");

const helper = require("./userTestHelper");

const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  setup = await globalSetup();
});
describe("GET", () => {
  test("get users", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("POST /api/users", () => {
  test("should create a new user successfully", async () => {
    // Fetch the initial number of users in the database
    const initialUsers = await helper.usersInDb();
    const initialUserCount = initialUsers.length;

    const testUser = {
      name: "DummyTestUser",
      username: "Hhhhheisenbergg", // Ensure this username is unique for the test
      password: "pwdeasyyy",
    };

    // Send a POST request to create a new user
    const response = await api
      .post("/api/users")
      .send(testUser)
      .expect(201)
      .expect("Content-Type", /application\/json/); // Check for JSON response

    // Validate that the response includes the created user's data
    assert.strictEqual(response.body.username, testUser.username);
    assert.strictEqual(response.body.name, testUser.name);
    assert.ok(response.body.id);

    // Fetch the updated list of users
    const updatedUsers = await helper.usersInDb();
    const updatedUserCount = updatedUsers.length;

    // Assert that a new user has been added
    assert.strictEqual(updatedUserCount, initialUserCount + 1);

    // Optionally check if the new user exists in the updated user list
    const createdUser = updatedUsers.find(
      (user) => user.username === testUser.username
    );
    assert.ok(createdUser);
    assert.strictEqual(createdUser.name, testUser.name);
  });
});

after(async () => {
  await mongoose.connection.close();
});
