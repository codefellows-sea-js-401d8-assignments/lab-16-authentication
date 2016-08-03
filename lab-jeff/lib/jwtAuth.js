'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/user');
// const handleError = require('http-errors');

module.exports = exports = function(req, res, next){
  new Promise ((resolve, reject) => {
    let authHeader = req.headers.authorization.split(' ');
    let decoded = jwt.verify(authHeader[1], process.env.APP_SECRET);
    User.findOne({'basic.username': decoded.idd})
      .then((user) => {
        req.user = user;
        next();
        resolve(user);
      }, reject);
  });
};
