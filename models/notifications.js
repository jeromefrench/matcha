let bdd = require('../models/account.js');

exports.save_notif = async function (login, login_i_send, notification,  callback){
	try {
		var lu = 1;
		var connected = users.find(u => u.login == login_i_send);
		if (connected == undefined){
			lu = 0;
		}
		var id_login = await bdd.get_id_user(login);
		var id_login_i_send = await bdd.get_id_user(login_i_send);
		var sql = "INSERT INTO `notifications` (`id`, `id_user`, `id_user_i_send`, `messages`, `lu`) VALUES (NULL, ?, ?, ?, ?);";
		var todo = [id_login, id_login_i_send, notification, lu];
		var result = await db.query(sql, todo);
		return (result);
	}
	catch (err){
		return err
	}
}

exports.get_notif = async function (login){
	try {
		var id_login = await bdd.get_id_user(login);
		var sql = "SELECT * FROM `notifications` WHERE `id_user_i_send` = ?";
		var todo = [id_login];
		var result = await db.query(sql, todo);
		return (result);
	}
	catch (err){
		return err
	}
}
