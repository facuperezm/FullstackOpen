require("dotenv").config();

const PORT = process.env.PORT;
const URL = process.env.MONGODB_URI;

module.exports = {
  PORT,
  URL,
};
