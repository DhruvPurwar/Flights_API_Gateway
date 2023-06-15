// Keep checks and validation in middlewares.
const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message =
      "Something went wrong authenticating user (from middleware)";

    ErrorResponse.error = new AppError([
      "Email not found in incoming request",
      StatusCodes.BAD_REQUEST,
    ]);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.password) {
    ErrorResponse.message =
      "Something went wrong authenticating user (from middleware)";

    ErrorResponse.error = new AppError([
      "Password not found in incoming request",
      StatusCodes.BAD_REQUEST,
    ]);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

module.exports = { validateAuthRequest };
