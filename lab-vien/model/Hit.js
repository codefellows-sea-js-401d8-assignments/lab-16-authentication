'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hitSchema = Schema({
  // id: {type: mongoose.Schema.ObjectId},
  name: {type: String, required: true},
  time: {type: String, required: true},
  price: {type: String, required: true},
  hitlistId: {type: mongoose.Schema.ObjectId}
});

module.exports = mongoose.model('Hit', hitSchema);
