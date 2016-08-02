'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const ErrorHandler = require('../lib/errorhandler');
const User = require('../model/usermodel');
const BasicHTTP = require('../lib/basichttp');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.generateHash(req.body.password)
    .then(() => {
      newUser.save().then(res.json.bind(res), ErrorHandler(400, next));
    }, ErrorHandler(500, next, 'Internal Server Error'));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = ErrorHandler(401, next, 'Authentication Error');
  User.findOne({'basic.email': req.auth.username})
    .then((user) => {
      if (!user) return authError;
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), authError);
    }, authError);
});
