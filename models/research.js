var conn = require('./connection_bdd.js');

// conn.connection.connect(function(err) {
// 	if (err) {
// 	  	console.error('error connecting: ' + err.stack);
// 	  	return;
// 	}
// 	console.log('connected as id ' + conn.connection.threadId);
// });


exports.get_user = function (a, callback){
	conn.connection.query('SELECT * FROM `user` ', function (error, results, fields) {
		// console.log(results);
		callback(results);
	});
}
