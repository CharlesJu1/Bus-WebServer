'use strict';
var cfg = require('../../config');
module.exports.getDevices = function(query, callback) {
  var collection = global.mongoDb.collection(cfg.devicesCollection);
  collection.find(query).toArray(callback);
};

module.exports.addDevices = function(dev, callback) {
  var collection = global.mongoDb.collection(cfg.devicesCollection);
  console.log("inserting to mongodb collection " + cfg.devicesCollection);
  collection.insertOne(dev, callback);
};

