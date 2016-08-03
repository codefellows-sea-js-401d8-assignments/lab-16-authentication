'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/user');
const HandleError = require('./error_handler');
const assert = require('assert');
module.exports = exports = function(req, res, next) {
  new Promise((resolve, reject) => {
    let authHeader = req.headers.authorization;
    assert(typeof authHeader === 'string', 'No auth token');
    authHeader = authHeader.split(' ');
    assert(authHeader[0] === 'Bearer', 'No auth token');
    let decodedToken = jwt.verify(authHeader[1], process.env.APP_SECRET);
    assert(decodedToken, 'Invalid auth token');
    User.findOne({'username': decodedToken.idd}).then((user) => {
      assert(user !== null, 'Unknown User');
      req.user = user;
      next();
      resolve(user);
    }, reject);
  }).catch(HandleError(401, next));
};
