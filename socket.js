const jwt = require('jsonwebtoken');
var conn = require('./models/connection_bdd.js');
var bdd = require('./models/bdd_functions.js');

function isBlock(userLog, isblockLog, callback){
	bdd.get_id_user(userLog, (userId) => {
		bdd.get_id_user(isblockLog, (isblockId) => {
			var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
			var todo = [userId, isblockId];
			conn.connection.query(sql, todo, (err, result) => {
				if (err){console.log(err);}
				else{
					callback(result[0].count);
				}
			});
		});
	});
	// var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
	// var todo = [userLog, isblockLog];
	// conn.connection.query(sql, todo, (err, result) => {
	// 	if (err){console.log(err);}
	// 	else{
	// 		console.log("block = " + result[0].count);
	// 		callback(result[0].count);
	// 	}
	// });
}

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
						socket.join(currentUser.login, () => {
							socket.on('vue_profile', (data) => {
								isBlock(data.room, currentUser.login, (block) => {
									if (block == 0){
										console.log("hello you ici bas");
										console.log(data);
										io.to(data.room).emit('notifvue', {user: currentUser.login});
									}	
								});
								// console.log("hello you ici bas");
								// console.log(data);
								// io.to(data.room).emit('notifvue', {user: currentUser.login});
							});
							socket.on('message', function(data){
								isBlock(data.room, currentUser.login, (block) => {
									if (block == 0){
										console.log("on a un new message");
    									console.log(data.room);
    									console.log(data.message);
    									//if (le current user a matcher avec data room){
    									io.to(data.room).emit('message', {message: data.message, leUser: currentUser.login});
										//}
									}
								});
							});
							socket.on('like', (data) => {
								isBlock(data.room, currentUser.login, (block) => {
									if (block == 0){
										if (data.like == 1){
											var sql = "SELECT COUNT(*) AS 'count' FROM `like_table` INNER JOIN `user` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` INNER JOIN `photo` ON `docker`.`photo`.`id_user` = `docker`.`like_table`.`id_user` WHERE `id_i_like` = ? AND `like_table`.`id_user` IN (SELECT `id_i_like` FROM `like_table` WHERE `id_user` = ?)";
											var todo = [currentUser.id, currentUser.id];
											conn.connection.query(sql, todo, (err, result) => {
												if (err) {console.log(err);}
												console.log('bla***********************');
												console.log(result[0].count);
												if (result[0].count != 0){
													io.to(data.room).emit('notifmatch', {user: currentUser.login});
												}
												else if (result[0].count == 0){
													io.to(data.room).emit('notiflike', {user: currentUser.login});
												}
											});
										}
									}
								});
							});
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
