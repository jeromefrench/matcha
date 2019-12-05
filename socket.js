const jwt = require('jsonwebtoken');

exports = module.exports = function(io){


	//io.on('message', function(data)//{
	//console.log("on a un new message");
    //							io.broadcast.to(data.room).emit('message', data.message);
	//
	//}//)

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
						}
						else{
							console.log("count = " + user.count);
							user.count++;
						}
							socket.on('vue_profile', (data) => {
								console.log("hello you ici");
								console.log(data);
							});
						socket.join(currentUser.login, () => {
							socket.on('vue_profile', (data) => {
								console.log("hello you ici bas");
								console.log(data);
							});
							socket.on('message', function(data){
								console.log("on a un new message");
    							console.log(data.room);
    							console.log(data.message);
    							//if (le current user a matcher avec data room){
    							io.to(data.room).emit('message', {message: data.message, leUser: currentUser.login});
    							//}
							});
							socket.on('like', (data) => {
								io.to(data.room).emit('notiflike', {user: currentUser.login});
							});
							console.log("ici toi");
							console.log("ici toi seconde");
						})
						console.log("tableau user");
						console.log(users);

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
