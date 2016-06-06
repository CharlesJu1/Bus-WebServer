// templates/server-setting.js is the template file used by gulp to generate the server/server-setting.js file
'use strict';
var cfg = {};

// @if SERVER_ENV == 'DEVELOPMENT'
cfg.mongoDbBusUrl = 'mongodb://localhost:27017/bus';
// @endif
// @if SERVER_ENV == 'TEST'
console.log('Node server running in development environment.');
cfg.mongoDbBusUrl = 'mongodb://localhost:27017/bus';
// @endif
// @if SERVER_ENV == 'PRODUCTION'
console.log('Node server running in development environment.');
cfg.mongoDbBusUrl = 'mongodb://nodejsclient:nodejsclient@ds052968.mlab.com:52968/WMillMongoDB';
// @endif
cfg.busRouteCollection = 'route';
cfg.busPositionCollection = 'position';

console.log('Node server running in development environment. mongoDbBusUrl= ' + cfg.mongoDbBusUrl);

module.exports = cfg;