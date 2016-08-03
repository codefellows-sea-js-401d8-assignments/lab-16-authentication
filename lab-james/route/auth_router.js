'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const BasicHTTP = require('../lib/basic_http');

const User = require('../model/user');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let badError = createError(400, 'Bad request');
  if (!req.body.username && !req.body.password) next(badError);
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.generateHash(req.body.password)
    .then((token) => {
      newUser.save((err, user) => {
        if (err) next(badError);
        if (user) {
          console.log('new user\n' + user);
          res.json(token);
        }
      });
    }).catch((err) => {
      next(err);
    });
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = createError(401, 'Authentication failed');
  if (!req.auth.username && !req.auth.password) next(authError);
  User.findOne({username: req.auth.username}, (err, user) => {
    if (!user) return next(authError);
    if (err) return next(authError);
    user.checkPassword(req.auth.password)
      .then(res.json.bind(res))
      .catch((err) => {
        next(err);
      });
  });
});
