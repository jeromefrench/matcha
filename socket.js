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
	});
}

function get_id_user (login, callback){
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
				});
			});
		});
	});
}

exports = module.exports = function(io){

	io.on('connection', socket => {
		var currentUser = null;
		socket.on('identify', (data) => {
			if (data.token){
				jwt.verify(data.token, 'secretkey', {algorithms: ['HS256']},  (err, decoded) => {
					if (err){
					}else{
						get_login_user(decoded.id, (loglog) => {
							currentUser = {
								id: decoded.id,
								login: loglog,
								count: 1
							};
							var user = users.find(u => u.id == currentUser.id);
							if (user == undefined){
								users.push(currentUser);
							}
							else{
								user.count++;
							}
							socket.join(currentUser.login, () => {
								socket.on('vue_profile', (data) => {
									isBlock(data.room, currentUser.login, (block) => {
										if (block == 0){
											io.to(data.room).emit('notifvue', {user: currentUser.login});
										}	
									});
								});
								socket.on('message', function(data){
									isBlock(data.room, currentUser.login, (block) => {
										isMatch(data.room, currentUser.login, (match) => {
											if (block == 0 && match == true){
												io.to(data.room).emit('message', {message: data.message, leUser: currentUser.login});
											}
										})
									});
								});
								socket.on('like', (data) => {
									isBlock(data.room, currentUser.login, (block) => {
										if (block == 0){
											if (data.like == 1){
												isMatch(data.room, currentUser.login, (match) => {
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
	
							socket.on('disconnect', () => {
								if (currentUser){
									user = users.find(u => u.id == currentUser.id);
									if (user){
										user.count--;
										if (user.count == 0){
											users = users.filter(u => u.id != currentUser.id);
										}
									}
								}
							});
						});

					}
				});
			}
			else{
				console.log("pas de token");
			}
		})
	})


}
