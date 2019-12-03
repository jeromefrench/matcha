
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
