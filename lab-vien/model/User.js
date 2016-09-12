'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const httpError = require('http-errors');

const userSchema = Schema({
  username: { type: String },
  basic: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    findHash: { type: String, unique: true }
  },
  role: { type: String, default: 'basic', required: true }
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
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, result) => {
      if (err)
        return reject(err);
      if (!result)
        return reject(httpError(401, 'password does not match'));
      resolve(this);
    });
  });
};

// todo: handle duplicate hashes somehow
userSchema.methods.generateFindHash = function() {
  return new Promise((resolve, reject) => {
    this.basic.findHash = crypto.randomBytes(32).toString('hex');
    this.save()
      .then(() => {
        resolve(this.basic.findHash);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

userSchema.methods.generateToken = function() {
  return new Promise((resolve, reject) => {
    this.generateFindHash()
      .then((findHash) => {
        resolve({ token: jwt.sign({ idd: findHash }, process.env.APP_SECRET) });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = mongoose.model('User', userSchema);
