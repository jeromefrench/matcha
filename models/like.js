var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');

exports.get_user = function (a, callback){
	conn.connection.query('SELECT * FROM `user` ', function (error, results, fields) {
		callback(results);
	});
}

exports.addLike = function (my_login, the_login_i_like){
	bdd.get_id_user(my_login, (my_id) => {
		bdd.get_id_user(the_login_i_like, (id_i_like) => {
			//verifier si on a pas deja liker cette personne

			console.log("my id " + my_id);
			console.log("the id i like" + id_i_like);

			var sql = "INSERT INTO `like_table` (id_user, id_i_like) VALUES (?, ?)";
			var todo = [my_id, id_i_like];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				console.log("infos added");
			});
		});
	});
};

exports.doILike = function (my_login, the_login_i_search, callback){
	bdd.get_id_user(my_login, (my_id) => {
		bdd.get_id_user(the_login_i_search, (id_i_like) => {
			//verifier si on a pas deja liker cette personne
			console.log("my id " + my_id);
			console.log("the id i like" + id_i_like);
			var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
			var todo = [my_id, id_i_like];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
				// console.log("result===========");
				// console.log(result);
				if (result[0] == undefined)
				{
					// console.log("vide");
					callback(false);
				}
				else
				{
					// console.log("pas vide");
					callback(true);
				}
			});
		});
	});
}
