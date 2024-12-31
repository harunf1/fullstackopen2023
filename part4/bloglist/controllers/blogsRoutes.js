const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, url } = request.body;
  console.log(request.token);
  const decodeToken = jwt.verify(request.token, JWT_SECRET);
  if (!decodeToken) {
    return response.status(404).json({ error: "invalid token" });
  }
  const user = await User.findById(decodeToken.id);
  if (!user) {
    return response.status(400).json({ error: "invalid user token" });
  }

  if (!title || !url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  const blog = new Blog({
    title,
    url,
    author: user.name,
    likes: request.body.likes || 0,
    user: user._id,
  });
  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  /*const decodeToken = jwt.verify(request.token, JWT_SECRET);
  if (!decodeToken) {
    return response.status(404).json({ error: "invalid token" });
  }
  const user = await User.findById(decodeToken.id);
  if (!user) {
    return response.status(400).json({ error: "invalid user token" });
  }

  
  if (user._id !== id) {
    return response
      .status(401)
      .json({ error: "unauthorised to delete this note " });
  }
*/
  const { id } = request.params;
  const deletedBlog = await Blog.findByIdAndDelete(id);
  if (!deletedBlog) {
    return response.status(404).json({ error: "Blog not found" });
  }
  response.status(200).json({ message: "blog deleted" });
});

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { title, author, url, likes } = request.body;

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
