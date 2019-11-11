var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : '192.168.99.100',
	user     : 'root',
	password : 'tiger',
	port	: '3306',
	database : 'docker'
});


connection.connect(function(err) {
	if (err) {
	  	console.error('error connecting: ' + err.stack);
	  	return;
	}
	console.log('connected as id ' + connection.threadId);
});


exports.get_user = function (){
	connection.query('SELECT * FROM `user` ', function (error, results, fields) {
		console.log(results);
		return results;
	});
}

exports.insert_user = function (name, passwd, fname, lname, mail){
	var sql = "INSERT INTO user (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
	var todo = [name, passwd, fname, lname, mail];
	connection.query(sql, todo, function (err, result) {
	  	if (err) throw err;
	  	console.log("1 record inserted");
	});
}

exports.get_id_user = function (login, callback){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result);
	});
}

exports.insert_info = function (id_user, gender, orientation, interest) {
	var sql = "INSERT INTO `info_user` (id_user, gender, orientation, interest) VALUES (?, ?, ?, ?)";
	var todo = [id_user, gender, orientation, interest];
	connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		console.log("infos added");
	});
}

exports.isLoginPasswdMatch = function (login, passwd, callback){
	var  sql = 'SELECT * FROM `user` WHERE `login` LIKE ? ';
	var todo = [login];
	var stop = false;
	connection.query(sql, todo, (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		console.log(results[0].login);

		if (results[0].passwd == passwd) {
            callback(true) ;
		}
		else {
            callback(false) ;
		}
	});
	console.log("ici");
}

exports.insert_message = function (content, date){
	var sql = "INSERT INTO messages (content, createat) VALUES (?, ?)";
	var todo = [content, date];
	connection.query(sql, todo, function (err, result) {
	  	if (err) throw err;
	  	console.log("1 record inserted");
	});
}

exports.recover_user = function (login, callback){
	var sql = "SELECT * FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	connection.query(sql, todo, function (err, results) {
		if (err) throw err;
		console.log(results[0].login);
		callback(results);
	});
};





		// Object.keys(results).forEach(function(key){
		//  	var row = results[key];
		// 	console.log(row.id);
		// 	if (row.passwd == passwd)
		// 	{
		// 		myEvent.emit('endPasswordMatch', true);
		// 		stop = true;
		// 		return;
		// 	}
		// });
		// if (stop == true)
		// 	return;
		// myEvent.emit('endPasswordMatch', false);
		// return;
