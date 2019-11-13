var conn = require('./connection_bdd.js');


exports.save_message = function (id_author, id_recever, message_content, data_stamp){
	var sql = "INSERT INTO `messages` (id_author, id_recever, message_content, data_stamp) VALUES (?, ?, ?, ?, ?)";
	var todo = [my_id, id_i_like];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		console.log("infos added");
	});
}

exports.get_message = function (id_author, id_recever, callback){
	var sql = "SELECT * FROM `messages` WHERE `id_author` = ? AND `id_recever` = ?";
	var todo = [id_author, id_recever];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result);
	});
}
