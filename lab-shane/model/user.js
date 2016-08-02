'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  basic: {
    email: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    }
  }
});

userSchema.methods.createHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, data) => {
      if (err) return reject(err);
      this.basic.password = data;
      resolve({
        token: jwt.sign({
          idd: this.basic.email
        }, process.env.APP_SECRET)
      });
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, data) => {
      if (err) return (err);
      if (data === false) return reject(new Error('Passwords did not match'));
      resolve({
        token: jwt.sign({
          idd: this.basic.email
        }, process.env.APP_SECRET)
      });
    });
  });
};

module.exports = exports = mongoose.model('User', userSchema);
