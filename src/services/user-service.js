const { UserRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const AppError = require("../utils/errors/app-error");
const { Auth } = require("../utils/common");
const userRepository = new UserRepository();

async function createUser(data) {
  try {
    const user = await userRepository.create(data);
    return user;
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      // errors is an array inside error object . errors is an array of objects.
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      console.log(explanation); // Will tell exact reason to developer why it failed.
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot create new instance of user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signin(data) {
  try {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "No user found for given email",
        StatusCodes.NOT_FOUND
      );
    }

    const passwordMatch = Auth.checkPassword(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError("Wrong password", StatusCodes.BAD_REQUEST);
    }
    const jwt = Auth.createToken({ id: user.id, email: user.email });
    return jwt;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.log(error);
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { createUser, signin };
