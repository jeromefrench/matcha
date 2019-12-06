
var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');


exports.save_notif = function (login, login_i_send, notification,  callback){
	connected = users.find(u => u.login == login_i_send);
	if (connected == undefined){
		lu = 0;
	}else{
		lu = 1;
	}
	bdd.get_id_user(login, (id_login) => {
		bdd.get_id_user(login_i_send, (id_login_i_send) => {
			var sql = "INSERT INTO `notifications` (`id`, `id_user`, `id_user_i_send`, `messages`, `lu`) VALUES (NULL, ?, ?, ?, ?);";
			var todo = [id_login, id_login_i_send, notification, lu];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				callback(result);
			});
		});
	});
}

exports.get_notif = function (login, callback){
	bdd.get_id_user(login, (id_login) => {
		var sql = "SELECT * FROM `notifications` WHERE `id_user_i_send` = ?";
		var todo = [id_login];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	});
}
