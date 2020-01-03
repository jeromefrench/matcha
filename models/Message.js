
exports.save_message = async function (id_author, id_recever, message_content, data_stamp){
	var sql = "INSERT INTO `messages` (id_author, id_recever, message_content, data_stamp) VALUES (?, ?, ?, ?)";
	var todo = [id_author, id_recever, message_content, data_stamp];
	result = await db.query(sql, todo);
}

exports.get_message = async function (id_author, id_recever){
	var sql = "SELECT * FROM `messages` WHERE `id_author` = ? AND `id_recever` = ? OR `id_recever` = ? AND `id_author` = ?";
	var todo = [id_author, id_recever, id_author, id_recever];
	result = await db.query(sql, todo);
	return (result);
}
