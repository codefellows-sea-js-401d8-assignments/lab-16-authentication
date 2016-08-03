'use strict';

const handleError = require('http-errors');

module.exports = exports = function(req, res, next) {
  try {
    let authBuffer = new Buffer(req.headers.authorization.split(' ')[1], 'base64');
    let authArr = authBuffer.toString().split(':');
    req.auth = {username: authArr[0], password: authArr[1]};
    authBuffer.fill(0);
    next();
  } catch(error) {
    next(handleError(500, 'Invalid Authentication'));
  }
};
