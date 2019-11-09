// const express = require('express');


var bdd = require('./bdd_functions.js');


bdd.get_user();







// 	const app = express();
// 	const port = 3000;
// 	var fs = require('fs');

// 	app.get('/', function (req, res){
// 		res.send('Hello World');
// 	});



// 	app.listen(port);

	// var http = require('http');

	// var server = http.createServer(function(req, res){
	// 	fs.readFile('./index.html', 'utf-8', function(error, content){
	// 		res.writeHead(200, {"content-Type": "text/html"});
	// 		res.end(content);
	// 	});
	// });


	// var io = require('socket.io').listen(server);

	// io.sockets.on('connection', function (socket){
	// 	console.log('Un client est connecte !');
	// });

	// server.listen(8080);
