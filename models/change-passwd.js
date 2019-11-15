var conn = require('./connection_bdd.js');

exports.IsFieldEmpty = function IsFieldEmpty(field, callback){
	if (field == undefined || field == "" || field.indexOf(" ") > -1)
		callback(false);
	callback(true);
}

exports.IsNewVerifMatch = function (npass, verif, callback){
	if (npass == verif){
		callback(true);
	}
	else{
		callback(false);
	}
}

exports.changePass = function (login, npass){
	var sql = "UPDATE `user` SET `passwd` = ? WHERE `login` LIKE ?";
	var todo = [npass, login];
	conn.connection.query(sql, todo, (err, result) => {
		if (err) throw err;
		console.log("pass changé !");
	});
}