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

module.exports = exports = mongoose.model('Users', userSchema);
