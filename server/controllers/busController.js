'use strict';
var express = require('express');
var router = express.Router();
var bus = require('../models/busModel');
//var bus = require('../models/busModel');

// router.get('/list', function(req, res) {
//   console.log('get /api/devices/list');
//   devices.getDevices({}, function(err, result) {
//   	if (err) {
//       res.status(500).send(err.message);
//     }
//     else {
//       res.status(200).send(result);
//     }
//   });
// });

//console.log('bus xxxxxxxx' + JSON.stringify(bus));

router.post('/position', function(req, res) {
  console.log('post /api/bus/position, body in req' + JSON.stringify(req.body));
  bus.updateBusPosition(req.body, function(err, result) {
    console.log("updateBusPosition callback");
    if (err) {
      res.status(500).send(err.message);
    }
    else {
      res.status(201).send(result);
    }
  });
});

router.post('/route', function(req, res) {
  console.log('busController.js: router.post: post /api/bus/route' + JSON.stringify(req.body));
  console.log('body in req' + JSON.stringify(req.body));
  bus.addBusRoute(req.body, function(err, result) {
    console.log("addBusRoute callback");
    if (err) {
      res.status(500).send(err.message);
    }
    else {
      res.status(201).send(result);
    }
  });
});


var lat, long;

function sendLocation(socket) {
  //console.log("sending location to clients. lat: " + lat + " long:" + long);
  return function() {
    socket.emit('locationUpdate', {'location' :{'lat': lat, 'long': long}});
  };
}

//TODO: need to handle socketIO disconnect event
function busSocketIoSetup(io) {
  //setup socketIO for a client connection
  io.on('connection', function(socket) {
    console.log("received socket IO connection !!!!!!!!!!!");
    socket.on('location', function(location) {

      // the location should be stored in MongoDB
      console.log('got client location: ' + 'lat:' + location.lat + 'long:' + location.long);
      lat = location.lat;
      long = location.long;
    })
    setInterval(sendLocation(socket), 5000);
  }); 
}

module.exports.busSocketIoSetup = busSocketIoSetup;

module.exports.router = router;
