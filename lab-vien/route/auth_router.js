'use strict';

const Router = require('express').Router;
const User = require('../model/User');
const jsonParser = require('body-parser').json();
const authParser = require('../lib/auth_parser');
const httpError = require('http-errors');
const authRouter = module.exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  signup(req)
  .then(token => res.json(token))
  .catch(next);
});

authRouter.get('/signin', authParser, (req, res, next) => {
  signin(req)
  .then(token => res.json(token))
  .catch(next);
});

let signup = function(req) {
  return new Promise((resolve, reject) => {
    if(!req.body.username || !req.body.password || !req.body.email) {
      return reject(httpError(400, 'required fields not satisfied'));
    }
    let newUser = new User();
    newUser.username = req.body.username;
    newUser.basic.email = req.body.email;
    newUser.generateHash(req.body.password)
    .then(newUser => newUser.save()) // http error for duplicated username here
    .then(newUser => newUser.generateToken())
    .then(token => resolve(token))
    .catch(err => reject(err));
  });
};

let signin = function(req) {
  return new Promise((resolve, reject) => {
    User.findOne({username: req.auth.username})
    .then((user) => {
      if (!user)
        return reject(httpError(401, 'no such user'));

      user.comparePassword(req.auth.password)
      .then(user => user.generateToken())
      .then(token => resolve(token))
      .catch(err => reject(err));
    });
  });
};
