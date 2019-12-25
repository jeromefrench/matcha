let bdd = require('../models/account.js');

exports.save_notif = async function (login, login_i_send, notification,  callback){
	connected = users.find(u => u.login == login_i_send);
	if (connected == undefined){
		lu = 0;
	}else{
		lu = 1;
	}
	id_login = await bdd.get_id_user(login);
	id_login_i_send = await bdd.get_id_user(login_i_send);
	var sql = "INSERT INTO `notifications` (`id`, `id_user`, `id_user_i_send`, `messages`, `lu`) VALUES (NULL, ?, ?, ?, ?);";
	var todo = [id_login, id_login_i_send, notification, lu];
	result = await db.query(sql, todo);
	return (result);
}

exports.get_notif = async function (login){
	id_login = await bdd.get_id_user(login);
	var sql = "SELECT * FROM `notifications` WHERE `id_user_i_send` = ?";
	var todo = [id_login];
	result = await db.query(sql, todo);
	return (result);
}
