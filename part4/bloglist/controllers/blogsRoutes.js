const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const { title, url } = request.body;
  if (!title || !url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }
  const user = request.user;
  const blog = new Blog({
    title,
    url,
    author: user.name,
    likes: request.body.likes || 0,
    user: user._id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  savedtouser = await user.save();
  response.status(201).json(result);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const { id } = request.params;

    const blogToDel = await Blog.findById(id);
    if (!blogToDel) {
      return response.status(404).json({ error: "Blog not found" });
    }
    if (blogToDel.user._id.toString() === user._id.toString()) {
      await blogToDel.deleteOne({ _id: id });
      user.blogs = user.blogs.filter((blogId) => blogId.toString() !== id);
      await user.save();
      response.status(200).json({ message: "blog deleted", blogToDel });
    } else {
      response.status(401).json({ error: "Unauthrised to take this action" });
    }
  }
);

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const { id } = request.params;
  const { title, author, url, likes } = request.body;
  if (blogToDel.user._id.toString() !== user._id.toString()) {
    rresponse.status(401).json({ error: "Unauthrised to take this action" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true, runValidators: true }
  );

  if (!updatedBlog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  response.status(200).json({
    message: "Blog updated successfully",
    blog: updatedBlog,
  });
});

module.exports = blogsRouter;
