'use strict';

module.exports = exports = function(req, res, next) {
  try {
    let header = req.headers.authorization, basicString = header.split(' ')[1], authBuffer = new Buffer(basicString, 'base64'), authString = authBuffer.toString(), authArr = authString.split(':');
    req.auth = {username: authArr[0], password: authArr[1]};
    authBuffer.fill(0);
    next();
  } catch (e) {
    e.statusCode = 400;
    e.message = 'Invalid Basic HTTP Authentication';
    next(e);
  }
};
