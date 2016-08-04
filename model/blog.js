'use strict';

const mongoose = require('mongoose');
const Peer = require('./peer.js');


let BlogSchema = mongoose.Schema ({
  name: {type: String, required: true, unique: true},
  topic: String
});

BlogSchema.methods.addPeer = function(peerData) {
  let peer = new Peer(peerData);
  peer.blogId = this._id;
  return peer.save();
};

BlogSchema.methods.addExistingPeer = function(peerId) {
  return peer.findOneAndUpdate({'_id': peerId}, {peerId: this._Id});
};

BlogSchema.methods.removePeer = function(peerId) {
  return Peer.findOneAndUpdate({'_id': peerId}, {blogId: null});
};

BlogSchema.methods.findAllPeers - function() {
  return Peer.find({blogId: this._id});
};

module.exports = exports = mongoose.model('blog', BlogSchema);
