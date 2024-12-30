const mongoose = require("mongoose");
const supertest = require("supertest");

const Note = require("../models/notes");
const helper = require("./testHelper");

const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");

const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});
  await Promise.all(helper.initialNotes.map((note) => new Note(note).save()));
});

describe("GET Requests for Notes API", () => {
  test("notes are returned as JSON", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");
    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map((r) => r.content);
    assert(contents.includes("HTML is easy"));
  });

  test("a specific note can be viewed", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];
    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(resultNote.body.content, noteToView.content);
  });
});
describe("POST Requests for Notes API", () => {
  test("successfully adds a valid note", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      important: true,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

    const contents = notesAtEnd.map((note) => note.content);
    assert(contents.includes(newNote.content));
  });

  test("fails to add a note without content", async () => {
    const newNote = { important: true };

    await api.post("/api/notes").send(newNote).expect(400);

    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
  });
});
describe("DELETE  Requests for Notes API", () => {
  test("successfully deletes a note", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1);

    const contents = notesAtEnd.map((note) => note.content);
    assert(!contents.includes(noteToDelete.content));
  });
});
describe("PUT Requests Requests for Notes API", () => {
  test("successfully updates the importance of a note", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToUpdate = notesAtStart[0];

    const updatedNote = { important: !noteToUpdate.important };

    const result = await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(updatedNote)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.important, updatedNote.important);
  });

  test("returns 400 for an invalid ID format", async () => {
    const invalidId = "1234";

    const updatedNote = { important: true };

    await api
      .put(`/api/notes/${invalidId}`)
      .send(updatedNote)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("returns 400 for a non-boolean importance field", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToUpdate = notesAtStart[0];

    const updatedNote = { important: "yes" };

    await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(updatedNote)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

after(async () => {
  await mongoose.connection.close();
});
