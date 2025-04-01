import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import loginService from "./services/login";

const defaultBlog = {
  title: "",
  author: "",
  likes: 0,
  url: "",
};
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newBlog, setNewBlog] = useState(defaultBlog);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    //check if any user info is here already in local storage
    const loggedUserJson = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
      console.log("user details found in local storage", user.user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
    } catch (exception) {
      setErrorMessage(`error ${exception}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 1000);
    }
  };

  const handleLogout = () => {
    console.log("user logged out cleared local storage tokens");
    try {
      window.localStorage.clear();
      setUser(null);
    } catch (error) {
      setErrorMessage(`error ${exception}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 1000);
    }
  };

  const handleNewBlogChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewBlogSubmit = async (event) => {
    event.preventDefault();
    try {
      const returnBlog = await blogService.addBlog(newBlog);
      setBlogs(blogs.concat(returnBlog));
      setNewBlog(defaultBlog);

      setSuccessMessage(`A new Blog ${returnBlog.title} has been added`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1000);
    } catch (exception) {
      setErrorMessage(`error ${exception.message}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 1000);
    }
  };

  const loginform = () => {
    return (
      <form onSubmit={handleLogin}>
        <label>username:</label>
        <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <br /> <br />
        <label>password:</label>
        <input
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        ></input>
        <br /> <br />
        <button type="submit">login</button>
      </form>
    );
  };

  const blogInfo = () => {
    return (
      <>
        <h2>blogs</h2>
        <p>Here are {`${user.name}'s`} blogs</p>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
        <br /> <br />
        <br /> <br />
        <form onSubmit={handleNewBlogSubmit}>
          Add a new blog
          <div>
            Blog Title
            <input
              type="text"
              name="title"
              value={newBlog.title}
              onChange={handleNewBlogChange}
            ></input>
          </div>
          <div>
            Author
            <input
              type="text"
              name="author"
              value={newBlog.author}
              onChange={handleNewBlogChange}
            ></input>
          </div>
          <div>
            Likes
            <input
              type="number"
              name="likes"
              value={newBlog.likes}
              onChange={handleNewBlogChange}
            ></input>
          </div>
          <div>
            URL
            <input
              type="text"
              name="url"
              value={newBlog.url}
              onChange={handleNewBlogChange}
            ></input>
          </div>
          <button type="submit">submit </button>
        </form>
        <button type="submit" onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  };

  return (
    <div>
      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      ></Notification>

      {user === null ? loginform() : blogInfo()}
    </div>
  );
};

export default App;
