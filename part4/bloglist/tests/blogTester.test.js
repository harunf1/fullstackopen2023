const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");

const globalSetup = require("./setup");
const mongoose = require("mongoose");

const blogTestHelper = require("./blogTestHelper");

const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blogs");

beforeEach(async () => {
  setup = await globalSetup();
});

describe(" GET Blogs", () => {
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

describe("Post blogs", () => {
  test("checks we can add a new blog", async () => {
    const initialBlogsCount = await Blog.countDocuments();
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://testblog.com",
      likes: 0,
      user: setup.newUser.id,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${setup.token}` })
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
      user: setup.newUser.id,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${setup.token}` })
      .expect(201);

    assert.strictEqual(response.body.likes, 0, "Likes should default to 0");
  });
});
describe("Delete blogs ", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await blogTestHelper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${setup.token}` })
      .expect(200);

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

describe("Update blogs", () => {
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
      .set({ Authorization: `Bearer ${setup.token}` })
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
