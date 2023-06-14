const { UserRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const AppError = require("../utils/errors/app-error");
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

module.exports = { createUser };
