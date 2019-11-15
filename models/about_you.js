let bdd = require('../models/bdd_functions.js');
var conn = require('./connection_bdd.js');

exports.get_photo = function (login, callback){
	bdd.get_id_user(login, (id_login) => {
		var sql = "SELECT * FROM `photos` WHERE `id_user` = ?";
		var todo = [id_login];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	});
}

exports.get_info_user = function (login, callback){
	bdd.get_id_user(login, (id_login) => {
		var sql = "SELECT * FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_login];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	});
}

exports.insert_info_user = function (id_user, gender, orientation, bio, interests){
	var sql = "	INSERT INTO `user_info` (`id_user`, `gender`, `orientation`, `bio`, `interests`) VALUES (?, ?, ?, ?, ?);";
	var todo = [id_user, gender, orientation, bio, interests];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
	});
}

exports.update_info_user = function (id_user, gender, orientation, bio, interests){
	var sql = "UPDATE `user_info` SET `gender` = ?, `orientation` = ?, `bio` = ?, `interests` = ?  WHERE `id_user` = ?";
	inter = "";
	itemsProcessed = 0;
	if (interests !=undefined && interests != null && Array.isArray(interests)){
		interests.forEach(function(interest) {
			if (inter == ""){
				inter += interest;
			}else{
				inter += "," + interest;
			}
			itemsProcessed++;
			if(itemsProcessed === interests.length) {
				var todo = [gender, orientation, bio, inter, id_user];
				conn.connection.query(sql, todo, (error, result) => {
					if (error) throw error;
				})
			}
		});
	}
	else {
		inter = interests;
		var todo = [gender, orientation, bio, inter, id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
		});
	}
}

exports.is_info_user_exist = function (login, callback){
	bdd.get_id_user(login,  (id_user) => {
		var sql = "SELECT * FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			if (result[0] == undefined) {
				callback(false);
			}
			else {
				callback(true);
			}
		});
	})
}
