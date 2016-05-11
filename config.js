'use strict';
var cfg = {};

// TODO Need to convert this to a template js file and use gulp task to generate app-setting.js
// as in the Bus2-App

if (process.env.PORT) {
	console.log('Nodejs running in ISS. process.env.PORT is set to' + process.env.PORT);
	cfg.mongoDbUrl = 'mongodb://nodejsclient:nodejsclient@ds052968.mlab.com:52968/WMillMongoDB';
}
else {
	console.log('Nodejs running standalone, not in IIS.');
  //cfg.mongoDbUrl = 'mongodb://nodejsclient:nodejsclient@ds052968.mlab.com:52968/WMillMongoDB';
	cfg.mongoDbBusUrl = 'mongodb://localhost:27017/bus';
}
cfg.busRouteCollection = 'route';
cfg.busPositionCollection = 'position';

module.exports = cfg;