'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shanesgroupieSchema = Schema({
  name: { type: String, required: true, unique: true},
  age: { type: Number, required: true},
  location: { type: String, required: true},
  userId: { type: mongoose.Schema.ObjectId }
});

module.exports = mongoose.model('Shanesgroupie', shanesgroupieSchema);
