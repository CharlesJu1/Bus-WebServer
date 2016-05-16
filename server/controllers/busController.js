'use strict';
var express = require('express');
var router = express.Router();
var debug = require('debug')('busController');
var bus = require('../models/busModel');

//TODO Need to convert console.log to debug

// broadcast the position to all the client sockets interested in this (city, line)
function broadcastPosition(bLinePosition) {
  console.log('busController.js broadcastPosition. Updating all interested sockets.');
  console.log('position' + JSON.stringify(bLinePosition));

  // broadcast the position to all sockets in the room identified by (city:line) in "/passenger" namespace
  var room = bLinePosition.city + ':' + bLinePosition.line;
  global.io.of('/passenger').to(room).emit('broadcast position', bLinePosition);
}

//TODO: need to handle socketIO disconnect event

//SockeIO is divided into two name spaces. One for bus drivers, one for passengers. 
//For now, bus driver use REST Api (post to /api/bus/position) to update bus position.
function busSocketIoSetup(io) {
  //setup socketIO for client connection in "/passenger" namespace
  io.of('/passenger').on('connection', function(socket) {
    console.log('Received socket IO connection on /passenger namespace. transport=' + socket.conn.transport.name);
    // Handle client registertration for position update from server.
    socket.on('register positionUpdate', function(busLine) {
      console.log('socket' + socket + 'registers for bus line ' + JSON.stringify(busLine));
      // Add socket to the room identified by the (city, line)
      socket.join(busLine.city + ':' + busLine.line);
    });
    // Handle client registertration for position update from server.
    socket.on('unregister positionUpdate', function(busLine) {
      console.log('socket' + socket + 'unregisters bus line ' + JSON.stringify(busLine));
      // Remove socket from the room identified by the (city, line)
      socket.leave(busLine.city + ':' + busLine.line);
    });

    // Handle client registertration for position update from server.
    socket.on('disconnect', function() {
      // Rooms are left automatically upon disconnection.
      console.log('socket' + socket + 'disconnected. ');
    });
  }); 
}

router.post('/position', function(req, res) {
  console.log('post /api/bus/position, body in req' + JSON.stringify(req.body));
  // Do we really need to store it in MongoDB? Maybe not for now.
  // If we want to keep the data for traffic analysis, then we need to store it.
  bus.updateBusPosition(req.body, function(err, result) {
    console.log("updateBusPosition callback");
    if (err) {
      res.status(500).send(err.message);
    }
    else {
      res.status(201).send(result);
    }
  });

  //req.body is BLinePosition as defined in bus.ts in Bus-App.
  broadcastPosition(req.body);
});

router.post('/route', function(req, res) {
  console.log('busController.js: router.post: post /api/bus/route' + JSON.stringify(req.body));
  console.log('body in req' + JSON.stringify(req.body));

  //req.body is BLineRoute as defined in bus.ts in Bus-App
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


module.exports.busSocketIoSetup = busSocketIoSetup;

module.exports.router = router;
