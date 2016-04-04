'use strict';
var cfg = {};

if (process.env.PORT) {
	console.log('Nodejs running in ISS. process.env.PORT is set to' + process.env.PORT);
	cfg.mongoDbUrl = 'mongodb://nodejsclient:nodejsclient@ds052968.mlab.com:52968/WMillMongoDB'
}
else {
	console.log('Nodejs running standalone with local mongodb')
	cfg.mongoDbUrl = 'mongodb://10.154.14.5:27017/test';
}
cfg.devicesCollection = 'devices';

module.exports = cfg;