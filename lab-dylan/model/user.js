'use strict';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: String
});

userSchema.methods.createHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, data) => {
      if (err) return reject(err);
      this.password = data;
      resolve({token: jwt.sign({idd: this.username}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, data) => {
      if (err) return reject(err);
      if (data === false) return reject(new Error('Invalid username and password'));
      resolve({token: jwt.sign({idd: this.username}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = userSchema;
