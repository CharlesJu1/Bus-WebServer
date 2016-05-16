'use strict';
var express = require('express');
var util = require('util');
var cors = require('cors');
var corsOptions = { 
	origin: true
};

var bodyParser = require('body-parser');
var busCtl = require('./server/controllers/busController');
var mongoClient = require('mongodb').MongoClient;

// config of mongoDb url
var cfg = require('./config');

var app = express();
var server = require('http').Server(app);

// global.io is used in busController.js
global.io = require('socket.io')(server);

var url = cfg.mongoDbBusUrl;
var mongoDb = '';

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(function() {
    console.log("Closed out remaining connections.");

    // shutdown mongoDB in the process.on('exit') hook.
    process.exit()
  });
  
   // if after 
   setTimeout(function() {
       console.error("Could not close connections in time, forcefully shutting down");
       process.exit()
   }, 10*1000);
}

// startWebServer is called in MongoDB connect callback
function startWebServer() {

  //When testing the mobile APP on browser with ionic serve, the app load the html files 
  //from a local webserver localhost:8100 started by ionic. This localhost:8100 will send 
  //AJAX requests to the nodejs server. The nodejs server needs to set the 
  //Access-Control-Allow-Origin: http://localhost:8100 so that the browser can allow the 
  //CORS request. Origin: true will set Access-Control-Allow-Origin to the origin in the request.
	app.use(cors(corsOptions));

  // This does not printout the incoming request body. It prints a lot other info of the req.
  // app.use(function(req, res, next) {
  //   console.log(util.inspect(req));
  //   next();
  // })

  // parse the request body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  
	app.get('/', function (req, res) {
	    res.send('this is /');
	});

	app.use('/data', express.static(__dirname + '/server/data'));

  //REST API. busController is a router to handle /api/bus
  app.use('/api/bus', busCtl.router);

  // socketIO for real time bus position
	busCtl.busSocketIoSetup(io);


	// listen for TERM signal .e.g. kill 
  process.on ('SIGTERM', gracefulShutdown);

	// listen for INT signal e.g. Ctrl-C
	process.on ('SIGINT', gracefulShutdown);   

  // shutdown webserver, then mongoDB
  process.on('exit', function () {
    console.log("Closing mongoDb connection");
    global.mongoDb.close();
    console.log("Exiting NodeJs Express");
  });

  // server start to receive incoming http request
	server.listen(process.env.PORT || 3000 , function () {
	    console.log('I\'m Listening on  port ...');
	    console.log(process.env.PORT || 3000);
	});
}

// Use connect method to connect to the Server. 
// db is a connection pool. Do not connect to db for each http request.
// the whole application only connect to mongoDB once
mongoClient.connect(url, function(err, db) {
	console.log("Connected to mongoDb. url= " + url);
	global.mongoDb = db;

  // start web server only if mongoDb connect success
	startWebServer();
});