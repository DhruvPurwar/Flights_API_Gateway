const { UserService } = require("../services");

const { StatusCodes, INTERNAL_SERVER_ERROR } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/**
 *
 * POST: /signup
 * req-body {email:'abc@gmail.com', password:'dhr'}
 */

async function createUser(req, res) {
  try {
    // Controller redirect req to services.
    const user = await UserService.createUser({
      email: req.body.email,
      password: req.body.password,
    });
    // structuring response in controllers.
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    // structuring response in controllers.
    ErrorResponse.error = error;
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    // Earlier error code was hardcoded, now we can see what error , airplane service has sent.
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createUser,
};
