'use strict';

const AppError = module.exports = function(message, statusCode, responseMessage) {
  Error.call(this);
  this.message = message;
  this.statusCode = statusCode;
  this.responseMessage = responseMessage;
};

AppError.prototype = Object.create(Error.prototype);

AppError.prototype.respond = function(res) {
  res.status(this.statusCode).json(this.responseMessage);
};

AppError.isAppError = function(error) {
  return error instanceof AppError;
};

AppError.error400 = function(msg) {
  return new AppError(msg, 400, 'bad request');
};

AppError.error404 = function(msg) {
  return new AppError(msg, 404, 'not found');
};

AppError.error500 = function(msg) {
  return new AppError(msg, 500, 'internal server error');
};
