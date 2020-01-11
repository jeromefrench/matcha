const jwt = require('jsonwebtoken');
const mysql = require('mysql');


// var connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'newuser',
// 	password : 'rootpasswd',
// 	port	: '3306',
// 	database : 'docker'
// });


var connection = mysql.createConnection({
	host     : '192.168.99.100',
	user     : 'root',
	password : 'tiger',
	port	: '3306',
	database : 'docker'
});

function get_login_user(id, callback){
	var sql = "SELECT `login` FROM `user` WHERE `id` = ?";
	var todo = [id];
	connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result[0].login);
	})
}

function get_id_user (login, callback){
	console.log("LOGIN");
	console.log(login);
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result[0].id);
	});
}

function isBlock(userLog, isblockLog, callback){
	get_id_user(userLog, (userId) => {
		get_id_user(isblockLog, (isblockId) => {
			var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
			var todo = [userId, isblockId];
			connection.query(sql, todo, (err, result) => {
				if (err){console.log(err);}
				else{
					callback(result[0].count);
				}
			});
		});
	});
}

function isMatch(userLog, ismatchLog, callback){
	get_id_user(userLog, (userId) => {
		get_id_user(ismatchLog, (ismatchId) => {
			var sql = "SELECT * FROM `like_table` INNER JOIN `user` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` INNER JOIN `photo` ON `docker`.`photo`.`id_user` = `docker`.`like_table`.`id_user` WHERE `id_i_like` = ? AND `like_table`.`id_user` IN (SELECT `id_i_like` FROM `like_table` WHERE `id_user` = ?)";
			var todo = [userId, userId];
			connection.query(sql, todo, (err, result) => {
				if(err){console.log(err);}
				else {
					var find = result.find(element => element.id_user == ismatchId);
					if (find == undefined){
						callback(false);
					}
					else{
						//console.log("find = " + find);
						callback(true);
					}
				}
			});
		});
	});
}

function wasMatch(userLog, wasmatchLog, callback){
	get_id_user(userLog, (userId) => {
		get_id_user(wasmatchLog, (wasmatchId) => {
			var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
			var todo = [userId, wasmatchId];
			connection.query(sql, todo, (err, result) => {
				callback(result[0]);
			});
		});
	});
}

function get_user_my_match (login, callback){
	var i = 0;
	get_id_user(login, (id_user) => {
		var sql = "SELECT * FROM `like_table` INNER JOIN `user` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` INNER JOIN `photo` ON `docker`.`photo`.`id_user` = `docker`.`like_table`.`id_user` WHERE `id_i_like` = ? AND `like_table`.`id_user` IN (SELECT `id_i_like` FROM `like_table` WHERE `id_user` = ?)";
		var todo = [id_user, id_user];
		connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	})
}

function updateMatch (userLog, ismatchLog){
	get_id_user(userLog, (userId) => {
		get_id_user(ismatchLog, (ismatchId) => {
			get_user_my_match(userLog, (matches) => {
				var sql = "UPDATE `like_table` SET `match` = ? WHERE `id_user` = ? AND `id_i_like` = ?";
				var find = matches.find(element => element.id == ismatchId);
				if (find != undefined){
					var todo = [1, userId, ismatchId];
				}
				else {
					var todo = [0, userId, ismatchId];
				}
				connection.query(sql, todo, (error, result) => {
					//console.log("match on like table UPDATED");
				});
			});
		});
	});
}

exports = module.exports = function(io){

	io.on('connection', socket => {
		var currentUser = null;
		// console.log("on a une connection");
		socket.on('identify', (data) => {
			if (data.token){
				jwt.verify(data.token, 'secretkey', {algorithms: ['HS256']},  (err, decoded) => {
					if (err){
						// console.log("token pas valid");
					}else{
						// console.log("token valid");
						// console.log(decoded);
						get_login_user(decoded.id, (loglog) => {
							currentUser = {
								id: decoded.id,
								login: loglog,
								count: 1
							};
							// console.log("USSSERRRRS TAAABBBB");
							// console.log(users);
	
							var user = users.find(u => u.id == currentUser.id);
							if (user == undefined){
								// console.log("ADDED");
								users.push(currentUser);
							}
							else{
								// console.log("count = " + user.count);
								user.count++;
							}
							socket.join(currentUser.login, () => {
								socket.on('vue_profile', (data) => {
									// console.log("ci ci");
									// console.log(currentUser);
									// console.log(data);
									isBlock(data.room, currentUser.login, (block) => {
										if (block == 0){
											// console.log("hello you ici bas");
											// console.log(data);
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
											// console.log("on a un new message");
											// console.log(data.room);
											// console.log(data.message);
											//if (le current user a matcher avec data room){
											io.to(data.room).emit('message', {message: data.message, leUser: currentUser.login});
											//}
										}
									});
								});
								socket.on('like', (data) => {
									// console.log("like like");
									// console.log(data);
									isBlock(data.room, currentUser.login, (block) => {
										if (block == 0){
											if (data.like == 1){
												isMatch(data.room, currentUser.login, (match) => {
													// console.log('bla***********************');
													// console.log(match);
													if (match != 0){
														io.to(data.room).emit('notifmatch', {user: currentUser.login});
													}
													else {
														io.to(data.room).emit('notiflike', {user: currentUser.login});
													}
												});
											}
											else if (data.like == 0){
												wasMatch(data.room, currentUser.login, (result) => {
													// console.log("HELLO ICI ICI ICI BAS");
													// console.log(data.room);
													if (result != undefined && result.match == 1){
														updateMatch(data.room, currentUser.login);
														updateMatch(currentUser.login, data.room);
														io.to(data.room).emit('notifnomatch', {user: currentUser.login});
													}
												});
											}
										}
									});
								});
							})
							// console.log("tableau user");
							// console.log(users);
	
							socket.on('disconnect', () => {
								if (currentUser){
									user = users.find(u => u.id == currentUser.id);
									if (user){
										user.count--;
										// console.log("nv count = " + user.count);
										if (user.count == 0){
											users = users.filter(u => u.id != currentUser.id);
											// console.log("lalalalalalalala");
											// console.log(users);
										}
									}
								}
							});
						});

						// currentUser = {
						// 	id: decoded.id,
						// 	login: decoded.username,
						// 	count: 1
						// };
						// // console.log("USSSERRRRS TAAABBBB");
						// // console.log(users);

						// var user = users.find(u => u.id == currentUser.id);
						// if (user == undefined){
						// 	// console.log("ADDED");
						// 	users.push(currentUser);
						// }
						// else{
						// 	// console.log("count = " + user.count);
						// 	user.count++;
						// }
						// socket.join(currentUser.login, () => {
						// 	socket.on('vue_profile', (data) => {
						// 		// console.log("ci ci");
						// 		// console.log(currentUser);
						// 		// console.log(data);
						// 		isBlock(data.room, currentUser.login, (block) => {
						// 			if (block == 0){
						// 				// console.log("hello you ici bas");
						// 				// console.log(data);
						// 				io.to(data.room).emit('notifvue', {user: currentUser.login});
						// 			}	
						// 		});
						// 		// console.log("hello you ici bas");
						// 		// console.log(data);
						// 		// io.to(data.room).emit('notifvue', {user: currentUser.login});
						// 	});
						// 	socket.on('message', function(data){
						// 		isBlock(data.room, currentUser.login, (block) => {
						// 			if (block == 0){
						// 				// console.log("on a un new message");
    					// 				// console.log(data.room);
    					// 				// console.log(data.message);
    					// 				//if (le current user a matcher avec data room){
    					// 				io.to(data.room).emit('message', {message: data.message, leUser: currentUser.login});
						// 				//}
						// 			}
						// 		});
						// 	});
						// 	socket.on('like', (data) => {
						// 		// console.log("like like");
						// 		// console.log(data);
						// 		isBlock(data.room, currentUser.login, (block) => {
						// 			if (block == 0){
						// 				if (data.like == 1){
						// 					isMatch(data.room, currentUser.login, (match) => {
						// 						// console.log('bla***********************');
						// 						// console.log(match);
						// 						if (match != 0){
						// 							io.to(data.room).emit('notifmatch', {user: currentUser.login});
						// 						}
						// 						else {
						// 							io.to(data.room).emit('notiflike', {user: currentUser.login});
						// 						}
						// 					});
						// 				}
						// 				else if (data.like == 0){
						// 					wasMatch(data.room, currentUser.login, (result) => {
						// 						// console.log("HELLO ICI ICI ICI BAS");
						// 						// console.log(data.room);
						// 						if (result != undefined && result.match == 1){
						// 							updateMatch(data.room, currentUser.login);
						// 							updateMatch(currentUser.login, data.room);
						// 							io.to(data.room).emit('notifnomatch', {user: currentUser.login});
						// 						}
						// 					});
						// 				}
						// 			}
						// 		});
						// 	});
						// })
						// // console.log("tableau user");
						// // console.log(users);

						// socket.on('disconnect', () => {
						// 	if (currentUser){
						// 		user = users.find(u => u.id == currentUser.id);
						// 		if (user){
						// 			user.count--;
						// 			// console.log("nv count = " + user.count);
						// 			if (user.count == 0){
						// 				users = users.filter(u => u.id != currentUser.id);
						// 				// console.log("lalalalalalalala");
						// 				// console.log(users);
						// 			}
						// 		}
						// 	}
						// });
					}
				});
			}
			else{
				// console.log("pas de token");
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
