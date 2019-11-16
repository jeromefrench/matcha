var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');

// conn.connection.connect(function(err) {
// 	if (err) {
// 	  	console.error('error connecting: ' + err.stack);
// 	  	return;
// 	}
// 	console.log('connected as id ' + conn.connection.threadId);
// });


exports.get_user = function (login, callback){
	// SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1


		// var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user`";

	bdd.get_id_user(login, (id_user) => {
		var sql = "	SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
		// conn.connection.query('SELECT * FROM `user` ', function (error, results, fields) {
		// 	// console.log(results);
		// 	callback(results);
		// });
	})
}
