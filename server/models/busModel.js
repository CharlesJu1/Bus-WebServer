'use strict';
var cfg = require('../../config');
module.exports.getBusRoute = function(query, callback) {
  var collection = global.mongoDb.collection(cfg.busRouteCollection);
  collection.find(query).toArray(callback);
};

module.exports.addBusRoute = function(dev, callback) {
  var collection = global.mongoDb.collection(cfg.busRouteCollection);
  console.log("inserting to mongodb collection" + JSON.stringify(cfg.busRouteCollection));
  collection.insertOne(dev, callback);
};
