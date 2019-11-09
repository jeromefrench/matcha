// const express = require('express');

var bdd = require('./bdd_functions.js');


// var results =  bdd.get_user();
// console.log("data" + results);
// bdd.insert_user("jean2", "jean-passwd2", "jeanname2", "dupond2", "jean@dupond2");
// bdd.insert_user("jean", "jean-passwd", "jeanname", "dupond", "jean@dupond");
bdd.isLoginPasswdMatch("jean", "jean-passwdwww");


bdd.myEvent.on('endPasswordMatch', function(result){
	if (result == true)
	{
		console.log("Password Match");
	}
	else
	{
		console.log("Password dont Match");
	}
})


// console.log("le match " + match);


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
