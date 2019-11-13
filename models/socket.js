var socket = require('socket.io');


exports.start_socket = function (server){
	var io = socket(server);
	console.log("my socket server is running");
	io.sockets.on('connection', newConnection);
}
function newConnection(socket){
	console.log("new connection: " + socket.id);
	socket.on('newmessage', f_new_message);
	io.sockets.on('disconnect', () =>
		{
			console.log("new disconnect: " + socket.id);
		});
}
function f_new_message(data){
	console.log("le Message: " + data);
}



