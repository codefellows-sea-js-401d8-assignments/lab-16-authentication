'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
  username: {type: String},
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  }
});

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, hash) => {
      if (err)
        return reject(err);
      this.basic.password = hash;
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, result) => {
      if (result === false)
        return reject(new Error('password does not match'));
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.generateRandomHash = function() {
  return new Promise((resolve, reject) => {
    this.randomHash = crypto.randomBytes(32).toString('hex');
    this.save()
      .then(() => {
        resolve(this.randomHash);
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
        resolve({token: jwt.sign({token: randomHash}, process.env.APP_SECRET)});
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = mongoose.model('User', userSchema);
