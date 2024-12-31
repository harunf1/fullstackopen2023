const logger = require("./logger");

const tokenExtractor = (req, res, next) => {
  if (req.path === "/api/login") {
    return next();
  }
  const auth = req.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    req.token = auth.replace("Bearer ", "");
    logger.info(req.token);
  } else {
    req.token = null;
  }
  next();
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

  if (error.message === "Token missing or invalid") {
    return response.status(401).json({ error: "Token missing or invalid" });
  }

  if (error.message === "Token invalid: missing user ID") {
    return response
      .status(401)
      .json({ error: "Token invalid: missing user ID" });
  }

  console.error(error.message);
  return response.status(500).json({ error: "Internal server error" });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
