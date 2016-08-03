'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  }
});

userSchema.methods.createHash = function(password){
  new Promise((resolve, reject) =>{
    bcrypt.hash(password, 8, (err, data) =>{
      if(err) return reject(err);
      this.basic.password = data;
      resolve(data);
    });
  });
};

userSchema.methods.comparePass = function(password){
  return new Promise((resolve, reject) =>{
    bcrypt.compare(password, this.basic.password, (err, data) =>{
      if (err) return reject(err);
      if (data === false) return reject(new Error('No matching password'));
    });
  });
};

module.exports = exports = mongoose.model('Users', userSchema);
