'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;
var cuid = require('cuid');
var EventEmitter = require('events').EventEmitter;

var Promise = require('promise');
var ReplicatorCommon = require('../');

describe('replicate-common node module', function () {

  var replicator1, replicator2, replicator3, channel1, channel2, channel3;

  function getChannel() {
    var channel = new EventEmitter();
    channel.addEventListener = function(msg, func) {
      channel.on(msg, func);
    };

    channel.send = function(chunk) {
      this.emit('send', chunk);
    };

    return channel;
  }

  function setupChannels() {
    channel1 = getChannel();
    channel2 = getChannel();
    channel3 = getChannel();

    replicator1.addPeer('replicator2', channel2);
    replicator1.addPeer('replicator3', channel3);
    replicator2.addPeer('replicator1', channel1);
    replicator2.addPeer('replicator3', channel3);
    replicator3.addPeer('replicator1', channel1);
    replicator3.addPeer('replicator2', channel2);
  }

  beforeEach(function() {
    replicator1 = new ReplicatorCommon('replicator1');
    replicator2 = new ReplicatorCommon('replicator2');
    replicator3 = new ReplicatorCommon('replicator3');

    setupChannels();
  });

  it('should find correct number of peers', function() {
    var peers = replicator1.getPeers();
    assert.equal(peers.length, 2);
  });

  it('should remove peers', function() {
    var peers = replicator1.getPeers();
    replicator1.removePeer(peers[0]);
    assert.equal(peers.length, 1);
  });
});
