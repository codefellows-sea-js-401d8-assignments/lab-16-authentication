'use strict';

const mongoose = require('mongoose');
const Hit = require('./Hit');
const Schema = mongoose.Schema;

const hitlistSchema = Schema({
  // id: {type: mongoose.Schema.ObjectId},
  hitman: {type: String, required: true},
  location: {type: String, required: true},
  note: {type: String, required: true}
});

hitlistSchema.methods.addNewHit = function(hitInfo) {
  let newHit = new Hit(hitInfo);
  newHit.hitlistId = this._id;
  return newHit.save();
};

hitlistSchema.methods.addHit = function(hitId) {
  return Hit.findByIdAndUpdate(hitId, {hitlistId: this._id});
};

hitlistSchema.methods.removeHit = function(hitId) { // only remove from list, not from existence
  return Hit.findByIdAndUpdate(hitId, {hitlistId: null});
};

hitlistSchema.methods.findAllHits = function() {
  return Hit.find({hitlistId: this._id});
};

module.exports = mongoose.model('Hitlist', hitlistSchema);
