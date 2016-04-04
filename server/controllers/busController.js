'use strict';

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