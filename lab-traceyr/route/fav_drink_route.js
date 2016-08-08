'use strict';

const Drink = require('../model/fav_drink');
const jsonParser = require('body-parser').json();
const ErrorHandle = require('../lib/err_response');
const jwt_auth = require('../lib/authz_parser');
let drinkRouter = module.exports = exports = require('express').Router();

drinkRouter.get('/:id', (req, res, next) =>{
  Drink.find(req.params.id).then(res.json.bind(res), ErrorHandle(500, next, 'Server Error'));
});

drinkRouter.post('/', jsonParser, jwt_auth, (req, res, next) => {
  req.body.userId = req.user._id;
  new Drink(req.body).save().then(res.json.bind(res), ErrorHandle(400, next));
});

drinkRouter.put('/:id', jsonParser, jwt_auth, (req, res, next) => {

});
