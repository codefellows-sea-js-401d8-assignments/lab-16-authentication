'use strict';
const assert = require('assert');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

module.exports = exports = function(req, res, next) {
  let authHeader = req.headers.authorization.split(' ');
  assert(authHeader[0] === 'Bearer', 'No authentication token found');
  let jsonToken = jwt.verify(authHeader[1], process.env.APP_SECRET);
  User.find({'_id': jsonToken.idd}, (err, user) => {
    if (err) next(err);
    if (user === null) next(err);
    console.log('user ' + user);
    next();
  });
};
