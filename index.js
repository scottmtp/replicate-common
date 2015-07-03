var RtcDataStream = require('rtcstream');

var Promise = require('promise');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var quickconnect = require('rtc-quickconnect');


var ReplicatorCommon = function(name, signalUrl, rtcOptions) {
  this.name = name;
  this.signalUrl = signalUrl;
  this.rtcOptions = rtcOptions;

  this.streams = [];
  this.peers = [];

  EventEmitter.call(this);
};

util.inherits(ReplicatorCommon, EventEmitter);
module.exports = ReplicatorCommon;

// api

ReplicatorCommon.prototype.receiveData = function(chunk) {
  console.log('not implemented');
};

ReplicatorCommon.prototype.replicate = function() {
  console.log('not implemented');
};

ReplicatorCommon.prototype.removePeer = function(id) {
  var idx = this.peers.indexOf(id);
  if (idx >= 0) {
    this.peers.splice(idx, 1);
    this.streams.splice(idx, 1);
  }
};

// common methods
ReplicatorCommon.prototype.join = function(minPeers) {
  minPeers = typeof minPeers !== 'undefined' ? minPeers : 0;
  var self = this;

  var p = new Promise(function(resolve, reject) {
    self.signaller = quickconnect(self.signalUrl, self.rtcOptions);
    self.signaller.createDataChannel(self.rtcOptions.room)
      .on('channel:opened:' + self.rtcOptions.room, function(id, dc) {
        self.addPeer(id, dc);
        if (self.peers.length >= minPeers) {
          resolve();
        }
      })
      .on('channel:closed:' + self.rtcOptions.room, function(id, dc) {
        self.removePeer(id);
      });
  });

  return p;
};

ReplicatorCommon.prototype.addPeer = function(id, dc) {
  var self = this;

  var stream = new RtcDataStream(this.name + ':' + id, dc);
  this.peers.push(id);
  this.streams.push(stream);

  stream.on('data', this.receiveData.bind(this));

};

ReplicatorCommon.prototype.close = function() {
  this.signaller.close();
};

ReplicatorCommon.prototype.getPeers = function() {
  return this.peers;
};