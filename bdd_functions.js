


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
	  	// error will be an Error if one occurred during the query
	  	// results will contain the results of the query
	  	// fields will contain information about the returned results fields (if any)
	});

}



