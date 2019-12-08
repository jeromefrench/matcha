var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');
var dash = require('../models/dashboard.js');

exports.add_visited_profile = function (my_login, login_i_visit, callback){
	bdd.get_id_user(my_login, (my_id) => {
		bdd.get_id_user(login_i_visit, (id_i_visit) => {
			var sql = "SELECT * FROM `visited` WHERE `id_user` = ? AND `id_visited` = ? ";
			var todo = [my_id, id_i_visit];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				console.log("Result visited");
				console.log(result);
				if (result[0] == undefined) {//on ajoute dans la base la visit
					console.log(my_id);
					console.log(id_i_visit);
					var sql = "INSERT INTO `visited` (`id`, `id_user`, `id_visited`) VALUES (NULL, ?, ?)";
					var todo = [my_id, id_i_visit];
					conn.connection.query(sql, todo, (error, result) => {
						if (error) throw error;
						callback();
					});
				}else {
					//pas besoin
					callback();
				}
			});
		})
	})
}

exports.get_user = function (a, callback){
	conn.connection.query('SELECT * FROM `user` ', function (error, results, fields) {
		callback(results);
	});
}

exports.doesItLikeMe = function (my_login, the_login_i_search, callback){
	bdd.get_id_user(my_login, (my_id) => {
		bdd.get_id_user(the_login_i_search, (id_i_like) => {
			//verifier si on a pas deja liker cette personne
			// console.log("my id " + my_id);
			// console.log("the id i like" + id_i_like);
			var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
			var todo = [id_i_like, my_id];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				if (result[0] == undefined) {
					callback(false);
				}
				else {
					callback(true);
				}
			});
		});
	});
}

exports.doILike = function (my_login, the_login_i_search, callback){
	bdd.get_id_user(my_login, (my_id) => {
		bdd.get_id_user(the_login_i_search, (id_i_like) => {
			//verifier si on a pas deja liker cette personne
			// console.log("my id " + my_id);
			// console.log("the id i like" + id_i_like);
			var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
			var todo = [my_id, id_i_like];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				if (result[0] == undefined) {
					callback(false);
				}
				else {
					callback(true);
				}
			});
		});
	});
}

exports.addLike = function (my_login, the_login_i_like){
	bdd.get_id_user(my_login, (my_id) => {
		bdd.get_id_user(the_login_i_like, (id_i_like) => {
			var sql = "INSERT INTO `like_table` (id_user, id_i_like) VALUES (?, ?)";
			var todo = [my_id, id_i_like];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				console.log("infos added");
			});
		});
	});
};

exports.unLike = function (my_login, the_login_i_like){
	bdd.get_id_user(my_login, (my_id) => {
		bdd.get_id_user(the_login_i_like, (id_i_like) => {
			var sql = "DELETE FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
			var todo = [my_id, id_i_like];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				console.log("infos removed");
			});
		});
	});
};

function getVue (id_user, callback){
	var sql = "SELECT * FROM `vue_profile` WHERE `id_user` = ?";
	var todo = [id_user];
	conn.connection.query(sql, todo, (err, profile) => {
		if (err) throw err;
		callback(profile[0].vue);
	});
}

exports.countVue = function (login, callback){
	var sql = "SELECT * FROM `user` WHERE `login` = ?";
	var todo = [login];
	conn.connection.query(sql, todo, (err, user) => {
		if (err) throw err;
		var id_user = user[0].id;
		sql = "SELECT COUNT(*) AS 'count' FROM `vue_profile` WHERE `id_user` = ?";
		todo = [id_user];
		conn.connection.query(sql, todo, (err, countId) => {
			if (err) throw err;
			if (countId[0].count == 0){
				sql = "INSERT INTO `vue_profile` (`id_user`) VALUES (?)";
				todo = [id_user];
				conn.connection.query(sql, todo, (err) => {
					if (err) throw err;
					console.log("id added !");
					sql = "UPDATE `vue_profile` SET `vue` = `vue` + 1 WHERE `id_user` = ?";
					todo = [id_user];
					conn.connection.query(sql, todo, (err) => {
						if (err) throw err;
						console.log("vue UPDATED for" + id_user);
						getVue(id_user, (nbVue) => {
							callback(nbVue);
						});
					});
				});
			}
			else{
				sql = "UPDATE `vue_profile` SET `vue` = `vue` + 1 WHERE `id_user` = ?";
				todo = [id_user];
				conn.connection.query(sql, todo, (err) => {
					if (err) throw err;
					console.log("vue updated for" + id_user);
					getVue(id_user, (nbVue) => {
						callback(nbVue);
					});
				});
			}
		});
	});
}

exports.countLike = function (login, callback){
	var sql = "SELECT * FROM `user` WHERE `login` = ?";
	var todo = [login];
	conn.connection.query(sql, todo, (err, user) => {
		if (err) throw err;
		var id_user = user[0].id;
		sql = "SELECT COUNT(*) AS 'count' FROM `like_table` WHERE `id_i_like` = ?";
		todo = [id_user];
		conn.connection.query(sql, todo, (err, like) => {
			if (err) throw err;
			callback(like[0].count);
		});
	});
}

exports.addLikeVue = function(id_user, countLike, nbVue, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `popularite` WHERE `id_user` = ?";
	var todo = [id_user];
	var pop = Math.round((countLike / nbVue) * 5);
	conn.connection.query(sql, todo, (err, result) => {
		if (err) throw err;
		if (result[0].count == 0){
			sql = "INSERT INTO `popularite` (`id_user`, `nb_like`, `nb_vue`, `pop`) VALUES (?, ?, ?, ?)";
			todo = [id_user, countLike, nbVue, pop];
			conn.connection.query(sql, todo, (err) => {
				if (err) throw err;
				console.log("pop inserted");
				sql = "SELECT * FROM `popularite` WHERE `id_user` = ?";
				todo = [id_user];
				conn.connection.query(sql, todo, (err, result) => {
					if (err) throw err;
					callback(result[0].pop);
				});
			});
		}
		else{
			sql = "UPDATE `popularite` SET `nb_like` = ? AND `nb_vue` = ? AND `pop` = ? WHERE `id_user` = ?";
			todo = [countLike, nbVue, pop, id_user];
			conn.connection.query(sql, todo, (err) => {
				if (err) throw err;
				console.log('pop updated');
				sql = "SELECT * FROM `popularite` WHERE `id_user` = ?";
				todo = [id_user];
				conn.connection.query(sql, todo, (err, result) => {
					if (err) throw err;
					callback(result[0].pop);
				});
			});
		}
	});
}

exports.updateMatch = function(userLog, ismatchLog){
	bdd.get_id_user(userLog, (userId) => {
		bdd.get_id_user(ismatchLog, (ismatchId) => {
			dash.get_user_my_match(userLog, (matches) => {
				var sql = "UPDATE `like_table` SET `match` = ? WHERE `id_user` = ? AND `id_i_like` = ?";
				var find = matches.find(element => element.id == ismatchId);
				if (find != undefined){
					var todo = [1, userId, ismatchId];
				}
				else {
					var todo = [0, userId, ismatchId];
				}
				conn.connection.query(sql, todo, (err) => {
					if (err){console.log(err);}
					else{
						console.log("match on like table UPDATED");
					}
				});
			});
		});
	});
}

exports.wasMatch = function(userLog, wasmatchLog, callback){
	bdd.get_id_user(userLog, (userId) => {
		bdd.get_id_user(wasmatchLog, (wasmatchId) => {
			var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
			var todo = [userId, wasmatchId];
			conn.connection.query(sql, todo, (err, result) => {
				if(err){console.log(err);}
				else{
					callback(result[0]);
				}
			});
		});
	});
}