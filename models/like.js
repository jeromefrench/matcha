var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');

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