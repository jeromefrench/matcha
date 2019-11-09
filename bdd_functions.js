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


var		EventEmitter = require('events').EventEmitter;
var		myEvent = new EventEmitter();

exports.myEvent = myEvent;

exports.isLoginPasswdMatch = function (login, passwd){
	var  sql = 'SELECT * FROM `user` WHERE `login` LIKE ? ';
	var todo = [login];
	var stop = false;
	connection.query(sql, todo, function (error, results, fields) {
		if (error) throw error;
		console.log(results);
		Object.keys(results).forEach(function(key){
		 	var row = results[key];
			console.log(row.id);
			if (row.passwd == passwd)
			{
				myEvent.emit('endPasswordMatch', true);
				stop = true;
				return;
			}
		});
		if (stop == true)
			return;
		myEvent.emit('endPasswordMatch', false);
		return;
	});
}
