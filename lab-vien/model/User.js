'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const APP_SECRET = 'test secret';

const userSchema = Schema({
  username: {type: String},
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    randomHash: {type: String, unique: true}
  }
});

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, hash) => {
      if (err)
        return reject(err);
      this.basic.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  console.log('comparing password');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, result) => {
      if (err)
        return reject(err);
      if (result === false)
        return reject(new Error('password does not match'));
      resolve(this);
    });
  });
};

userSchema.methods.generateRandomHash = function() {
  return new Promise((resolve, reject) => {
    this.basic.randomHash = crypto.randomBytes(32).toString('hex');
    this.save()
      .then(() => {
        resolve(this.basic.randomHash);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

userSchema.methods.generateToken = function() {
  return new Promise((resolve, reject) => {
    this.generateRandomHash()
      .then((randomHash) => {
        resolve({token: jwt.sign({token: randomHash}, APP_SECRET)});
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = mongoose.model('User', userSchema);
