const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

require("express-async-errors");

const config = require("./utils/config");
const middleware = require("./utils/middleware.js");

const blogsRouter = require("./controllers/blogsRoutes.js");
const usersRouter = require("./controllers/usersRouter.js");
const loginRouter = require("./controllers/login.js");

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    console.log("connected to MONGODB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(morgan("tiny", { skip: () => process.env.NODE_ENV === "test" }));

app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
