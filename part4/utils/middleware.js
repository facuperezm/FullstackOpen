const logger = require("./logger");
const jwt = require("jsonwebtoken");

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  try {
    const decodedToken = await jwt.verify(request.token, process.env.SECRET);
    request.decodedToken = decodedToken;
  } catch (error) {
    request.decodedToken = null;
  }
  next();
};

const unknownHandler = (request, response) =>
  response.status(404).send("Unknown Endpoint");

const errorHandler = (error, request, response, next) => {
  logger.error(error);
  if (error.name === "CastError") {
    response.status(400).send({
      error: "Malformatted ID",
    });
  } else if (error.name === "ValidationError") {
    response.status(400).send(error.message);
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  } else {
    response.sendStatus(500).end();
  }
  next(error);
};

module.exports = {
  unknownHandler,
  errorHandler,
  tokenExtractor,
};
