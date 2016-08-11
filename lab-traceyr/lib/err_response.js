'use strict';

module.exports = exports = function(statusCode, cb, message){
  return function(err){
    message = message || err.message;
    return cb({err, message, statusCode});
  };
};
