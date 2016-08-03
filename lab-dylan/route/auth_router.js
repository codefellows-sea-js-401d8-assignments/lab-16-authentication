'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const HandleError = require('../lib/error_handler');
const User = require('../model/user');
const BasicHTTP = require('../lib/basic_http');
const authorization = require('../lib/authorization');
const jwt_auth = require('../lib/jwt_auth');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.createHash(req.body.password)
    .then((tokenData) => {
      newUser.save().then(() => {res.json(tokenData)}, HandleError(500, next, 'Server Error'))
    }, HandleError(500, next, 'Server Error'));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = HandleError(401, next, 'Invalid username and/or password');
  User.findOne({'username': req.auth.username}).then((user) => {
    if (!user) return authError(new Error('No such user'));
    user.comparePassword(req.auth.password).then(res.json.bind(res), authError);
  }, authError);
});

authRouter.put('/addrole/:userid', jsonParser, jwt_auth, authorization(['trainer']), (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role:req.body.role}})
    .then(res.json.bind(res), HandleError(500, next, 'Server Error'));
});

authRouter.get('/users', jsonParser, jwt_auth, authorization(), (req, res, next) => {
  User.find().then(res.json.bind(res), HandleError(500, next, 'Server Error'));
});
