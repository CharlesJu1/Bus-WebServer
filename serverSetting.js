// templates/server-setting.js is the template file used by gulp to generate the server/server-setting.js file
'use strict';
var cfg = {};

cfg.mongoDbBusUrl = 'mongodb://localhost:27017/bus';
cfg.busRouteCollection = 'route';
cfg.busPositionCollection = 'position';

console.log('Node server running in development environment. mongoDbBusUrl= ' + cfg.mongoDbBusUrl);

module.exports = cfg;