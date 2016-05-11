'use strict';
var cfg = require('../../config');


// Client sends JSON string to Node.js server. Node.js bodyParser parses the JSON string into JSON oject.
// Server and client need to agree on busRoute definition.

module.exports.getBusRoute = function(query, callback) {
  var collection = global.mongoDb.collection(cfg.busRouteCollection);
  collection.find(query).toArray(callback);
};

// busRoute is a JSON object. Identified by (city, line no., fromStop, toStop)
module.exports.addBusRoute = function(busRoute, callback) {
  var collection = global.mongoDb.collection(cfg.busRouteCollection);
  var filter = {};

  //setup busRoute filter
  filter.city = busRoute.city;
  filter.line = busRoute.line;
  filter.rtDirection = busRoute.rtDirection;

  // collection.find(filter).limit(1).next(function(err, doc) { 
  //   if (err) {
  //     console.log('busModel.js addBusRoute error :' + err);
  //   }
  //   else {
  //     console.log('find one busRoute: ' + JSON.stringify(doc));
  //   }
  // });

  console.log("inserting/updating mongodb bus routes collection" + JSON.stringify(cfg.busRouteCollection));

  // A route will be inserted if not exists. Otherwise, it will be replaced by the new route.
  // findOneAndReplace() can provide more control. Here we use replaceOne()
  collection.replaceOne(filter, busRoute, {upsert: true}, callback);
};


// One bus idenified by plate has one current position
module.exports.updateBusPosition = function(busPosition, callback) {
  var filter = {};

  //setup busRoute filter
  filter.plate = busPosition.plate;
  console.log("updating mongodb bus position collection" + JSON.stringify(cfg.busPositionCollection));
  var collection = global.mongoDb.collection(cfg.busPositionCollection);

  // A position will be inserted if not exists. Otherwise, it will be replaced by the new position.
  // findOneAndReplace() can provide more control. Here we use replaceOne()
  collection.replaceOne(filter, busPosition, {upsert: true}, callback);
};
