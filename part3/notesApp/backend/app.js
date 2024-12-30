// IMPORTED LIBRARIES

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");

// MY OWN MODULES
const { morganLogger } = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
//CONNECTING TO DB

mongoose.set("strictQuery", false);
const url = config.MONGODB_URI;
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

//BUILDING APPLICATION
const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(morganLogger);
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
