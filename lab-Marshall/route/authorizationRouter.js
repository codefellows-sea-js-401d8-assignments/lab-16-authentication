'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const handleError = require('../lib/handleError');
const User = require ('../model/users');
const BasicHTTP = require('../lib/basicHTTP');
const Auth = require('../lib/authorization');
const jwtAuth = require('../lib/jwtAuth');

let authorizationRouter = module.exports = exports = Router();

authorizationRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User;
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.generateHash(req.body.password)
    .then((token) => {
      newUser.save().then(() => {res.json(token)}, handleError(400, next));
    }, handleError(500, next, '500: server error'));
});

authorizationRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = handleError(401, next, 'Authentication failed!');
  User.findOne({'basic.email': req.auth.username})
    .then((user) => {
      if (!user) return authError(new Error('No such error'));
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), authError);
    }, authError);
});

authorizationRouter.get('/:id', (req, res, next) => {
  let handleDbError = handleError(400, next, '400: bad request');
  let fourOhFour = handleError(404, next);
  User.findOne({'_id': req.params.id}).then((data) => {
    if (!data) return next(fourOhFour(new Error('404: No user found!!!')));
    res.json(data);
  }, handleDbError);
});
