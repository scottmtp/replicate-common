'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;
var cuid = require('cuid');

var Promise = require('promise');
var ReplicatorCommon = require('../');

describe('replicate-common node module', function () {

  var replicator1, replicator2, replicator3;
  var signalUrl = 'http://localhost:3000/';
  
  beforeEach(function(done) {
    var rtcOpts = {
      room: cuid(),
      plugins: [ require('rtc-plugin-node') ]
    };

    replicator1 = new ReplicatorCommon('replicator1', signalUrl, rtcOpts);
    replicator2 = new ReplicatorCommon('replicator2', signalUrl, rtcOpts);
    replicator3 = new ReplicatorCommon('replicator3', signalUrl, rtcOpts);

    Promise.all([replicator1.join(2), replicator2.join(2), replicator3.join(2)])
      .then(function() {
        done();
      });
      
  });

  it('should find correct number of peers', function() {
    var peers = replicator1.getPeers();
    assert.equal(peers.length, 2);
  });
});