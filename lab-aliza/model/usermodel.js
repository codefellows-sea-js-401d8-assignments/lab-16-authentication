'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PandaSchema = require('./pandamodel.js');

let UserSchema = mongoose.Schema({
  basic: {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  }
});

UserSchema.methods.newPanda = function(pandaData){
  let panda = new PandaSchema(pandaData);
  panda.userId = this._id;
  return panda.save();
};

UserSchema.methods.addPanda = function(pandaId) {
  return PandaSchema.findOneAndUpdate({'_id': pandaId}, {userId: this._id});
};

UserSchema.methods.getAllPandas = function() {
  return PandaSchema.find({userId: this._id});
};

UserSchema.methods.removePanda = function(pandaId) {
  return PandaSchema.findOneAndUpdate({'_id': pandaId}, {userId: null});
};

UserSchema.methods.createHash = function(password){
  return new Promise((resolve, reject)=>{
    bcrypt.hash(password, 10, (err, data) =>{
      if (err) return reject(err);
      this.basic.password = data;
      resolve({token: jwt.sign({idd: this.basic.username}, process.env.APP_SECRET)});
    });
  });
};

UserSchema.methods.comparePass = function(password){
  return new Promise((resolve, reject) =>{
    bcrypt.compare(password, this.basic.password, (err, data) => {
      if (err) return reject(err);
      if (data === false) return reject(new Error('No matching password'));
      resolve({token: jwt.sign({idd: this.basic.username}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = mongoose.model('User', UserSchema);
