var conn = require('./connection_bdd.js');

exports.save_message = function (id_author, id_recever, message_content, data_stamp){
	var sql = "INSERT INTO `messages` (id_author, id_recever, message_content, data_stamp) VALUES (?, ?, ?, ?)";
	var todo = [id_author, id_recever, message_content, data_stamp];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		console.log("infos added");
	});
}

exports.get_message = function (id_author, id_recever, callback){
	console.log("l'id author " + id_author);
	console.log("l'id recever " + id_recever);
	var sql = "SELECT * FROM `messages` WHERE `id_author` = ? AND `id_recever` = ? OR `id_recever` = ? AND `id_author` = ?";
	var todo = [id_author, id_recever, id_author, id_recever];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		console.log("les resultat !!!!" + result);
		console.log(result);
		callback(result);
	});
}
