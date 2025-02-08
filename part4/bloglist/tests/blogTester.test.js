const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blogs");
const blogTestHelper = require("./blogTestHelper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const globalSetup = require("./setup");
let token;

test.before(async () => {
  token = await globalSetup();
  console.log("token", token);
});

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of blogTestHelper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("TEST FOR GETTING BLOGS", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    const blogs = response.body;

    assert(blogs.length > 0, "There should be at least one blog post");
    blogs.forEach((blog) => {
      assert(blog.id, "Each blog should have an 'id' property");
      assert(!blog._id, "Blog should not have '_id' property");
    });
  });
});

describe("TEST FOR POSTING BLOGS", async () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://testblog.com",
      likes: 0,
    };

    const initialBlogsCount = await Blog.countDocuments();

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const finalBlogsCount = await Blog.countDocuments();
    assert.strictEqual(
      finalBlogsCount,
      initialBlogsCount + 1,
      "Blog count should increase by 1"
    );

    const blogsAtEnd = await blogTestHelper.blogsInDb();
    const titles = blogsAtEnd.map((blog) => blog.title);
    assert(
      titles.includes(newBlog.title),
      "The new blog should be in the database"
    );
  });

  test("likes property defaults to 0 if not provided", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://testblog.com",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201);

    assert.strictEqual(response.body.likes, 0, "Likes should default to 0");
  });
});

describe("TEST FOR DELETING BLOGS", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await blogTestHelper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await blogTestHelper.blogsInDb();

    assert.strictEqual(
      blogsAtEnd.length,
      blogsAtStart.length - 1,
      "Blog count should decrease by 1"
    );

    const titles = blogsAtEnd.map((blog) => blog.title);
    assert(
      !titles.includes(blogToDelete.title),
      "The deleted blog should not be in the database"
    );
  });
});

describe("TEST FOR UPDATING BLOGS", () => {
  test("a blog can be updated", async () => {
    const blogsAtStart = await blogTestHelper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await blogTestHelper.blogsInDb();
    const updatedBlogInDb = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );

    assert.strictEqual(
      updatedBlogInDb.likes,
      blogToUpdate.likes + 1,
      "The number of likes should be increased by 1"
    );

    assert.deepStrictEqual(
      updatedBlogInDb,
      updatedBlog,
      "The updated blog should match the sent data"
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
