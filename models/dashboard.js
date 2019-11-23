var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');


exports.get_user_i_like = function (login, callback){
	bdd.get_id_user(login, (id_user) => {
		var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`like_table` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_i_like` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1 AND `docker`.`like_table`.`id_user` = ?";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	})
}

exports.get_user_they_like_me = function (login, callback){
	bdd.get_id_user(login, (id_user) => {
		var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`like_table` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1 AND `docker`.`like_table`.`id_i_like` = ?";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	})
}

//probleme
exports.get_user_my_match = function (login, callback){
	bdd.get_id_user(login, (id_user) => {
		var sql = " SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`like_table` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_i_like` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1 AND `docker`.`like_table`.`id_user` = ? OR `docker`.`like_table`.`id_i_like` = ?";
		var todo = [id_user, id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	})
}

exports.get_user_they_watched_me = function (login, callback){
	bdd.get_id_user(login, (id_user) => {
		var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`visited` ON `docker`.`user`.`id` = `docker`.`visited`.`id_user` WHERE `docker`.`visited`.`id_visited` = ?";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	})
}
