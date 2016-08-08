'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/user_model');
const assert = require('assert');
const ErrorHandle = require('./err_response');

module.exports = exports = function(req, res, next){
  new Promise((resolve, reject) => {
    let authHeader = req.headers.authorization;
    assert(typeof authHeader === 'string', 'Np auth tokten provided');
    authHeader = authHeader.split(' ');
    assert(authHeader[0] === 'Bearer', 'No auth token provided');
    let decoded = jwt.verify(authHeader[1], process.env.APP_SECRET);
    assert(decoded, 'Invalid Token');
    User.findOne({'basic.email': decoded.idd})
      .then((user) =>{
        assert(user !== null, 'Could not find user');
        req.user = user;
        next();
        resolve(user);
      }, reject);
  }).catch(ErrorHandle(401, next));
};
