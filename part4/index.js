const http = require("http");
const app = require("./app");
const config = require("./utils/config");

require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const server = http.createServer(app);
server.listen(config.PORT, () =>
  console.log(`Server running on port ${config.PORT}`)
);

module.exports = {
  MONGODB_URI,
  PORT,
};
