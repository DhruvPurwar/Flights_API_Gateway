const { UserRepository, RoleRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const AppError = require("../utils/errors/app-error");
const { Auth, Enums } = require("../utils/common");
const role = require("../models/role");
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
  try {
    const user = await userRepository.create(data);
    const role = await roleRepository.getRoleByName(
      Enums.USER_ROLES_ENUMS.CUSTOMER
    );
    user.addRole(role);
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

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("JWT token missing", StatusCodes.BAD_REQUEST);
    }
    const response = Auth.verifyToken(token);
    const user = await userRepository.get(response.id);
    if (!user) {
      throw new AppError("No user found", StatusCodes.NOT_FOUND);
    }
    return user.id;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.name == "JsonWebToken") {
      throw new AppError("Invalid JWT token", StatusCodes.BAD_REQUEST);
    }
    if (error.name == "TokenExpiredError") {
      throw new AppError("JWT token expired", StatusCodes.BAD_REQUEST);
    }
    console.log(error);
    throw error;
  }
}

module.exports = { createUser, signin, isAuthenticated };
