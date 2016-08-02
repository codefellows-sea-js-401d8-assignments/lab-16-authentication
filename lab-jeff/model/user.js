'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
  basic: {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  }
});

UserSchema.methods.generateHash = function(password){
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (err, data) => {
      if (err) return reject(err);
      this.basic.password = data;
      resolve({token: jwt.sign({idd: this.basic.username}, process.env.APP_SECRET)});
    });
  });
};

UserSchema.methods.compareHash = function(password){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, data) => {
      if (err) return reject(err);
      if (data === false) return reject(new Error('Passwords dont match.'));
      resolve({token: jwt.sign({idd: this.basic.username}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = mongoose.model('User', UserSchema);
