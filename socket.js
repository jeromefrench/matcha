const jwt = require('jsonwebtoken');

exports = module.exports = function(io){

	io.on('connection', socket => {
		var currentUser = null;
		console.log("on a une connection");
		socket.on('identify', (data) => {
			if (data.token){
				jwt.verify(data.token, 'secretkey', {algorithms: ['HS256']},  (err, decoded) => {
					if (err){
						console.log("token pas valid");
					}else{
						console.log("token valid");
						console.log(decoded);
						currentUser = {
							id: decoded.id,
							login: decoded.username,
							count: 1
						};
						console.log("USSSERRRRS TAAABBBB");
						console.log(users);
						var user = users.find(u => u.id == currentUser.id);
						if (user == undefined){
							console.log("ADDED");
							users.push(currentUser);
							// socket.emit('result_connect', {result: true})
						}
						else{
							console.log("count = " + user.count);
							user.count++;
						}
						socket.on('disconnect', () => {
							if (currentUser){
								user = users.find(u => u.id == currentUser.id);
								if (user){
									user.count--;
									console.log("nv count = " + user.count);
									if (user.count == 0){
										users = users.filter(u => u.id != currentUser.id);
										console.log("lalalalalalalala");
										console.log(users);
									}
								}
							}
						});
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