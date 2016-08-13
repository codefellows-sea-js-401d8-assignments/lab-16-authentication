'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const UserSchema = require('../model/usermodel');
const BasicHTTP = require('../lib/http_handle');
const HTTPError = require('http-errors');

let userRouter = Router();

userRouter.post('/signup', jsonParser, (req, res, next) => {
  if (!req.body.username && !req.body.password) next(HTTPError(400, 'bad request'));
  let newUser = new UserSchema();
  newUser.basic.username = req.body.username;  newUser.createHash(req.body.password)
    .then((hash) => {
      newUser.save((err, user) => {
        if (err) return next(HTTPError(400, 'bad request'));
        if (user) return res.json(hash);
      });
    });
});

userRouter.get('/signin', BasicHTTP, function(req, res, next) {
  if(!req.auth.username || !req.auth.password) return HTTPError(404, next, 'could not authorize');
  UserSchema.findOne({'basic.username': req.auth.username})
    .then((user) => {
      if (!user) return HTTPError(404, next, 'could not authorize');
      user.comparePass(req.auth.password)
        .then(res.json.bind(res), HTTPError(404, next, 'could not authorize'));
    }, HTTPError(400, next, 'invalid id'));
});

module.exports = exports = userRouter;
