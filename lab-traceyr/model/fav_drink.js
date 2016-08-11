'use strict';

const mongoose = require('mongoose');

module.exports = exports = mongoose.model('favDrink', {
  name: {type: String, required: true},
  mainIng: {type: String, default: 'coffee'},
  userId: String
});
