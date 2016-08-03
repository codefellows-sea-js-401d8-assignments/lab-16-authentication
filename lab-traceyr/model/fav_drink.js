'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavDrinkSchema = new Schema({
  name: String,
  mainIng: String,
  userId: this._id
});
