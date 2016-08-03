'use strict';

const Pokemon = require('../model/pokemon');
const HandleError = require('../lib/error_handler');
const jwt_auth = require('../lib/jwt_auth');
const authorization = require('../lib/authorization');
const jsonParser = require('body-parser').json();

let pokemonRouter = module.exports = exports = require('express').Router();

pokemonRouter.get('/', (req, res, next) => {
  Pokemon.find().then(res.json.bind(res), HandleError(500, next, 'Server Error'));
});

pokemonRouter.post('/', jsonParser, jwt_auth, authorization(['trainer']), (req, res, next) => {
  req.body.trainerId = req.user._id;
  new Pokemon(req.body).save().then(res.json.bind(res), HandleError(400, next));
});
