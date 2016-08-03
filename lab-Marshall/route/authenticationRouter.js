'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const handleError = require('../lib/handleError');
const User = require('../model/users');
const BasicHTTP = require('../lib/basicHTTP');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.generateHash(req.body.password)
    .then(() => {
      newUser.save().then(res.json.bind(res), handleError(400, next, 'bad request'));
    }, handleError(500, next, '500: server error!'));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = handleError(401, next, 'Incorrect password! Are you a dirty hacker?');
  User.findOne({'basic.email': req.auth.username})
    .then((user) => {
      if (!user) return authError;
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), authError);
    }, authError);
});
