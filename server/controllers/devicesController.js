'use strict';
var express = require('express');
var router = express.Router();
var devices = require('../models/devices');

router.get('/list', function(req, res) {
  console.log('get /api/devices/list');
  devices.getDevices({}, function(err, result) {
  	if (err) {
      res.status(500).send(err.message);
    }
    else {
      res.status(200).send(result);
    }
  });
});

router.post('/add', function(req, res) {
  console.log('post /api/devices/add');
  var dev = {};
  dev.name = req.body.name;
  devices.addDevices(dev, function(err, result) {
  	console.log("addDevice callback");
    if (err) {
      res.status(500).send(err.message);
    }
    else {
      res.status(201).send(result);
    }
  });
});

module.exports = router;
