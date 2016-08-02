'use strict';

module.exports = exports = function(statusCode, cb, message) {
  return function(error) {
    message = message || error.message;
    cb({error, statusCode, message, type:'AppError'});
  };
};
