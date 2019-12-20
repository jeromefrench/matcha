var conn = require('./connection_bdd.js');


exports.get_id_user = function (login, callback){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result[0].id);
	});
}

function get_id_user (login, callback){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result[0].id);
	});
}

exports.get_completed = function (login, callback){
	get_id_user(login, (id_user) => {
		var sql = "SELECT `completed` FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result[0]);
		});
	})
}

exports.insert_message = function (content, date){
	var sql = "INSERT INTO messages (content, createat) VALUES (?, ?)";
	var todo = [content, date];
	conn.connection.query(sql, todo, function (err, result) {
	  	if (err) throw err;
	  	console.log("1 record inserted");
	});
}

exports.recover_user = function (login, callback){
	var sql = "SELECT *, `user`.`id` AS 'id_user' FROM `user` INNER JOIN `user_info` ON `user`.`id` = `user_info`.`id_user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, function (err, results) {
		if (err) throw err;
		callback(results);
	});
}


exports.insert_log = function (id_user){
	var  sql = 'INSERT INTO `connection_log` (`id_user`, `last_visit`) VALUES (?, ?)';
	date = new Date();
	var todo = [id_user, date];
	conn.connection.query(sql, todo, (error, results, fields) => {
		if (error) throw error;
	});
}

function getRandomInt(max){
	return Math.floor(Math.random() * Math.floor(max));
}

exports.add_fakeVueLike = function (id_user){
	var vue = getRandomInt(1000);
	if (vue == 0){vue = 1;}
	var like = getRandomInt(vue);
	var pop = (like / vue) * 5;
	var sql = "INSERT INTO `vue_profile` (`id_user`, `vue`) VALUES (?, ?)";
	var todo = [id_user, vue];
	conn.connection.query(sql, todo, (err) => {
		if (err) throw err;
		console.log("fake vue inserted");
		sql = "INSERT INTO `popularite` (`id_user`, `nb_like`, `nb_vue`, `pop`) VALUES (?, ?, ?, ?)";
		todo = [id_user, like, vue, pop];
		conn.connection.query(sql, todo, (err) => {
			if (err) throw err;
			console.log("fake pop inserted");
		});
	});
}
