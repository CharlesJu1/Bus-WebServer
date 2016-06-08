// templates/server-setting.js is the template file used by gulp to generate the server/server-setting.js file
'use strict';
var cfg = {};

console.log('Node server running in production environment.');
// busmongodb is in west US region. It is created from mlab.com. 
// manage.windowsazure.com does not have west US as region to create mongodb.
cfg.mongoDbBusUrl = 'mongodb://nodejsclient:nodejsclient@ds034279.mlab.com:34279/busmongodb';

//WMillMongoDB is created from Azure. Somehow it is created in North Europe region.
//cfg.mongoDbBusUrl = 'mongodb://nodejsclient:nodejsclient@ds052968.mlab.com:52968/WMillMongoDB';
cfg.busRouteCollection = 'route';
cfg.busPositionCollection = 'position';

console.log('mongoDbBusUrl= ' + cfg.mongoDbBusUrl);

module.exports = cfg;