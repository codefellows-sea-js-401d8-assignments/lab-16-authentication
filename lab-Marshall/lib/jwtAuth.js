'use strict';

const jwt = require('jsonwebtoken');
const assert = require('assert');
const User = require('../model/users');
const handleError = require('./handleError');

module.exports = exports = function(req, res, next){
  new Promise((resolve, reject) => {
    let authHeader = req.headers.authorization;
    assert(typeof authHeader === 'string', 'No auth token');
    authHeader = authHeader.split(' ');
    assert(authHeader[0] === 'Bearer', 'No auth token');
    let decoded = jwt.verify(authHeader[1], process.env.APP_SECRET);
    assert(decoded, 'Invalid Token');
    User.findOne({'basic.email': decoded.idd})
      .then((user) => {
        assert(user !== null, 'NO USER FOUND');
        req.user = user;
        next();
        resolve(user);
      }, reject);
  }).catch(handleError(401, next));
};
