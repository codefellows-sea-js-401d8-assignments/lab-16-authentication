'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const ErrorHandler = require('../lib/errorHandler');
const User = require('../model/user');
const BasicHTTP = require('../lib/basicHttp');
const jwt_auth = require('../lib/jwt-auth');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username;
  newUser.generateHash(req.body.password)
    .then(() => {
      newUser.save().then(res.json.bind(res), ErrorHandler(400, next));
    }, ErrorHandler(400, next, 'bad request'));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = ErrorHandler(401, next, 'Authentication Failed');
  User.findOne({'basic.email': req.auth.username})
    .then((user) => {
      if (!user) return authError;
      user.comparePassword(req.auth.password).then(res.json.bind(res), authError);
    }, authError);
});

authRouter.put('/addrole/:userid', jsonParser, jwt_auth, (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role: req.body.role}}).then(res.json.bind(res), ErrorHandler(500, next, 'server error'));
});

authRouter.get('/users', jsonParser, jwt_auth, (req, res, next) => {
  User.find().then(res.json.bind(res), ErrorHandler(500, next, 'server error'));
});
