'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const jwtAuth = require('../lib/jwt_auth');

const createError = require('http-errors');
const Hero = require('../model/hero');
const User = require('../model/user');

let heroRouter = module.exports = exports = Router();

heroRouter.get('/', (req, res) => {
  let newUser = User();
  newUser.findAllHeroes(res);
});

heroRouter.post('/', jwtAuth, jsonParser, (req, res, next) => {
  if (!req.body.name && !req.body.race && !req.body.faction) {
    next(createError(400, 'Bad request.'));
  }
  let newUser = User();
  newUser.buildHero(req.body, res);
});

//put
heroRouter.put('/:id', jsonParser, () => {

});

//delete
heroRouter.delete('/:id', jsonParser, () => {

});
