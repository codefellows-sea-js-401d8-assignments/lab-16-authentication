'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createError = require('http-errors');

const saltRounds = 10;

const Hero = require('../model/hero');

let userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required: true, default: 'basic'}
});

userSchema.methods.buildHero = function(heroData, res) {
  let newHero = new Hero(heroData);
  newHero.userId = res._id;
  return newHero.save((err, hero) => {
    if (err) res.send(err.message);
    res.json(hero);
  });
};

userSchema.methods.findAllHeroes = function(res) {
  Hero.find({}, (err, heroes) => {
    if (err) return console.log('holy moly');
    res.json(heroes);
  });
};

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return reject('rejected generateHash');
      this.password = hash;
      resolve({token: jwt.sign({idd: this._id}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.checkPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, comparison) => {
      if (err) return reject(err);
      if (comparison === false) return reject(createError(401, 'Authentication failed'));
      resolve({token: jwt.sign({idd: this._id}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = mongoose.model('user', userSchema);
