const morgan = require("morgan");

const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

const morganLogger = morgan("tiny", {
  skip: () => process.env.NODE_ENV === "test",
});

module.exports = {
  info,
  error,
  morganLogger,
};
