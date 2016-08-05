'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  username: String,
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  }
});

userSchema.methods.createHash = function(password){
  return new Promise((resolve, reject) =>{
    bcrypt.hash(password, 8, (err, data) =>{
      if(err) return reject(err);
      this.basic.password = data;
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.comparePass = function(password){
  return new Promise((resolve, reject) =>{
    bcrypt.compare(password, this.basic.password, (err, data) =>{
      if (err) return reject(err);
      if (data === false) return reject(new Error('No matching password'));
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = mongoose.model('User', userSchema);
