const jwt = require('jsonwebtoken');
var conn = require('./models/connection_bdd.js');
var bdd = require('./models/bdd_functions.js');
var like = require('./models/like.js');

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
}

function isMatch(userLog, ismatchLog, callback){
	bdd.get_id_user(userLog, (userId) => {
		bdd.get_id_user(ismatchLog, (ismatchId) => {
			var sql = "SELECT * FROM `like_table` INNER JOIN `user` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` INNER JOIN `photo` ON `docker`.`photo`.`id_user` = `docker`.`like_table`.`id_user` WHERE `id_i_like` = ? AND `like_table`.`id_user` IN (SELECT `id_i_like` FROM `like_table` WHERE `id_user` = ?)";
			var todo = [userId, userId];
			conn.connection.query(sql, todo, (err, result) => {
				if(err){console.log(err);}
				else {
					var find = result.find(element => element.id_user == ismatchId);
					if (find == undefined){
						callback(false);
					}
					else{
						console.log("find = " + find);
						callback(true);
					}
				}
			});
		});
	});
	// var sql = "SELECT COUNT(*) AS 'count' FROM `like_table` INNER JOIN `user` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` INNER JOIN `photo` ON `docker`.`photo`.`id_user` = `docker`.`like_table`.`id_user` WHERE `id_i_like` = ? AND `like_table`.`id_user` IN (SELECT `id_i_like` FROM `like_table` WHERE `id_user` = ?)";
	// var todo = [userLog, ismatchLog];
	// conn.connection.query(sql, todo, (err, result) => {
	// 	if(err){console.log(err);}
	// 	else {
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
											isMatch(data.room, currentUser.login, (match) => {
												console.log('bla***********************');
												console.log(match);
												if (match != 0){
													io.to(data.room).emit('notifmatch', {user: currentUser.login});
												}
												else {
													io.to(data.room).emit('notiflike', {user: currentUser.login});
												}
											});
										}
										else if (data.like == 0){
											like.wasMatch(data.room, currentUser.login, (result) => {
												console.log("HELLO ICI ICI ICI BAS");
												console.log(data.room);
												if (result != undefined && result.match == 1){
													like.updateMatch(data.room, currentUser.login);
													like.updateMatch(currentUser.login, data.room);
													io.to(data.room).emit('notifnomatch', {user: currentUser.login});
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
