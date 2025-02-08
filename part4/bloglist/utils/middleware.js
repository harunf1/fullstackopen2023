const logger = require("./logger");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const tokenExtractor = (req, res, next) => {
  if (req.path === "/api/login") {
    return next();
  }
  const auth = req.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    req.token = auth.replace("Bearer ", "");
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token === null) {
    response.status(404).json({ error: "No Token provided" });
  } else {
    const decodeToken = jwt.verify(request.token, JWT_SECRET);

    const user = await User.findById(decodeToken.id);
    if (!user) {
      return response.status(400).json({ error: "invalid user token" });
    }
    request.user = user;

    next();
  }
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "MongoServerError" && error.code === 11000) {
    return response
      .status(400)
      .json({ error: "Duplicate key error: username must be unique" });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Invalid token" });
  }
  if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "Token expired" });
  }

  if (error.message === "Token missing or invalid") {
    return response.status(401).json({ error: "Token missing or invalid" });
  }

  if (error.message === "Token invalid: missing user ID") {
    return response
      .status(401)
      .json({ error: "Token invalid: missing user ID" });
  }

  console.error(`Error on ${request.method} ${request.path}: ${error.message}`);
  return response.status(500).json({ error: "Internal server error" });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
