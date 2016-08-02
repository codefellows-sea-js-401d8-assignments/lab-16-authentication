'use strict';
const errMessage = require('debug')('auth:error');

module.exports = exports = function(statusCode, callback, message) {
  return function(error) {
    message = message || error.message;
    errMessage(error);
    return callback({error, message, statusCode});
  };
};
