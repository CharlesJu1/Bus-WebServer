'use strict';
var express = require('express');

//When testing the mobile APP on browser with ionic serve, the app load the html files 
//from a local webserver localhost:8100 started by ionic. This localhost:8100 will send 
//AJAX requests to the nodejs server. The nodejs server needs to set the 
//Access-Control-Allow-Origin: http://localhost:8100 so that the browser can allow the 
//CORS request.
var cors = require('cors');
var corsOptions = { 
	origin: true
};

var bodyParser = require('body-parser');
var devicesController = require('./server/controllers/devicesController');
var mongoClient = require('mongodb').MongoClient;
var cfg = require('./config');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bus = require('./server/controllers/busController');

var url = cfg.mongoDbUrl;
var mongoDb = '';

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(function() {
    console.log("Closed out remaining connections.");
    process.exit()
  });
  
   // if after 
   setTimeout(function() {
       console.error("Could not close connections in time, forcefully shutting down");
       process.exit()
   }, 10*1000);
}

function startWebServer() {
	app.use(cors(corsOptions));
	app.use(bodyParser());
	app.get('/', function (req, res) {
	    res.send('this is /');
	});

	app.use('/data', express.static(__dirname + '/server/data'));

	//REST API. devicesController is a router to handle /api/devices
	app.use('/api/devices', devicesController);

	bus.busSocketIoSetup(io);

	process.on('exit', function () {
	  console.log("Closing mongoDb connection");
	  global.mongoDb.close();
	  console.log("Exiting NodeJs Express");
	});

	// listen for TERM signal .e.g. kill 
  process.on ('SIGTERM', gracefulShutdown);

	// listen for INT signal e.g. Ctrl-C
	process.on ('SIGINT', gracefulShutdown);   

	server.listen(process.env.PORT || 3000 , function () {
	    console.log('I\'m Listening on  port ...');
	    console.log(process.env.PORT || 3000);
	});
}

// Use connect method to connect to the Server. 
// db is a connection pool. Do not connect to db for each http request.
mongoClient.connect(url, function(err, db) {
	console.log("Connected to mongoDb. url= " + url);
	global.mongoDb = db;
	startWebServer();
});