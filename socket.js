const jwt = require('jsonwebtoken');

exports = module.exports = function(io){

	io.on('connection', socket => {
		console.log("on a une connection");
		socket.on('identify', (data) => {
			if (data.token){
				jwt.verify(data.token, 'secretkey', {algorithms: ['HS256']},  (err, decoded) => {
					if (err){
						console.log("token pas valid");
					}else{
						console.log("token valid");
						console.log(decoded);
						socket.emit('result_connect', {result: true})
					}
				});
			}
			else{
				console.log("pas de token");
			}
		})
		// 	client.on('join', handleJoin);
		// 	client.on('message', handleMessage);
	})

	function handleJoin(){
	}

	function handleMessage(){
	}

}






//var connection = [];
//const JWT_SIGN_SECRET = '0gtrdg546hretsdyj86jtr5djhyd876j4tsjy8d6jry';
// var socket = require('socket.io');
// var io = socket(server);
// var jwt = require('jsonwebtoken');


// console.log("my socket server is running");
// io.sockets.on('connection', newConnection);

// function newConnection(socket){
// 	console.log("un utilisateur s'est connecté");
// 	socket.on('identify', ({token}) => {
// 		try {
// 			var decoded = jwt.verify(token, JWT_SIGN_SECRET, {
// 				algorithms: ['HS256']
// 			})
// 			console.log(decoded);
// 		} catch (e) {
// 			console.error(e.message);
// 		}
// 	});




// socket.emit('message', 'Vous etes bien connecte !');
// socket.broadcast.emit('message', 'Un autre client vient de se connecter !');
// socket.on('petit_nouveau', function(pseudo){
// 	socket.pseudo = pseudo;
// });
// socket.on('message', function (message){
// 	console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);

// })



// }

// function newConnection(socket){
// 	console.log("new connection: " + socket.id);
// 	socket.on('newmessage', f_new_message);
// 	io.sockets.on('disconnect', () =>
// 		{
// 			console.log("new disconnect: " + socket.id);
// 		});
// }
// function f_new_message(data){
// 	console.log("le Message: " + data);
// }








