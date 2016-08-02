'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const HandleError = require('../lib/error_handler');
const User = require('../models/user');
const BasicHTTP = require('../lib/basic_http');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.createHash(req.body.password).then(() => {
    newUser.save().then(res.json.bind(res), HandleError(400, next));
  }, HandleError(500, next, 'Server Error'));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = HandleError(401, next, 'Invalid username and/or password');
  User.findOne({'username': req.auth.username}).then((user) => {
    if (!user) return authError;
    user.comparePassword(req.auth.password).then(res.json.bind(res), authError);
  }, authError);
});
