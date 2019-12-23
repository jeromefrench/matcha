//**********************connection**********************************************
const util = require( 'util' );
const mysql = require( 'mysql' );

config = { host     : '192.168.99.100',
	user     : 'root',
	password : 'tiger',
	port	: '3306',
	database : 'docker' };

function makeConn(config){
	const connection = mysql.createConnection( config );
	return {
		query( sql, args ) {
			return util.promisify( connection.query )
				.call( connection, sql, args );
		},
		close() {
			return util.promisify( connection.end ).call( connection );
		}
	};
}


db = makeConn(config);

exports.get_id_user = async function (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return (result[0].id);
}

async function get_id_user (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return (result[0].id);
}




//******************************GET about you***********************************
// exports.get_info_user = async function (login){
// 	id_login = await get_id_user(login);
// 	var sql = "SELECT *, DATE_FORMAT(`birthday`, '%Y\\%m\\%d') as birth FROM `user_info` WHERE `id_user` = ?";
// 	var todo = [id_login];
// 	result = await db.query(sql, todo);
// }

exports.get_photo = async function (login){
	id_login = await get_id_user(login);
	var sql = "SELECT * FROM `photos` WHERE `id_user` = ?";
	var todo = [id_login];
	result = await db.query(sql, todo);
	return (result);
}

exports.getPic = async function (id_user){
	var sql = "SELECT * FROM `photo` WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	if (result[0] == undefined) {
		return (false);
	}
	else {
		return (result);
	}
}

exports.count_photo = async function count_photo (id_user){
	var sql = "SELECT count(*) as 'count' FROM `photo` WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	if (result[0] == undefined) {
		return (0);
	}
	else {
		return (result[0].count);
	}
}

exports.isCompleted = async function (id_user){
	var sql = "UPDATE `user_info` SET `completed` = 1 WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	if (error) throw error;
}

//*************************************************************************
//******************POST****************************************************
exports.InfoUser = async function (login, property, field){
	userExist = await is_info_user_exist(login);
	if (userExist){
		update_info_user(login, property, field);
	} else {
		insert_info_user(login, property, field);
	}
}

//******************POST****************************************************

async function update_info_user (login, property, field){
	if (property != "interests"){
		id_user = await get_id_user(login);
		var sql = "UPDATE `user_info` SET `"+property+"` = ? WHERE `id_user` = ?";
		var todo = [field, id_user];
		result = await db.query(sql, todo);
	}
	else{
		interests = field;
		var sql = "UPDATE `user_info` SET `interests` = ?  WHERE `id_user` = ?";
		inter = "";
		itemsProcessed = 0;
		if (interests != undefined && interests != null && Array.isArray(interests)){
			interests.forEach(async function(interest) {
				if (inter == ""){
					inter += interest;
				}else{
					inter += "," + interest;
				}
				itemsProcessed++;
				if(itemsProcessed === interests.length) {
					var todo = [inter,id_user];
					result = await db.query(sql, todo);
				}
			});
		}
		else {
			inter = interests;
			var todo = [inter, id_user];
			result = await db.query(sql, todo);
		}
	}
}

async function insert_info_user (login, property, field){
	if (property != "interests"){
		id_user = await get_id_user(login);
		var sql = "INSERT INTO `user_info` (`id_user`, `"+property+"`) VALUES (?, ?);";
		var todo = [id_user, field];
		result = await db.query(sql, todo);
	}
	else
	{
		interests = field;
		var sql = "INSERT INTO `user_info` (`id_user`, `interests`) VALUES (?, ?);";
		inter = "";
		itemsProcessed = 0;
		if (interests !=undefined && interests != null && Array.isArray(interests)){
			interests.forEach(async function(interest) {
				if (inter == ""){
					inter += interest;
				}else{
					inter += "," + interest;
				}
				itemsProcessed++;
				if(itemsProcessed === interests.length) {
					var todo = [id_user, inter];
					result = await db.query(sql, todo);
				}
			});
		}
		else {
			inter = interests;
			var todo = [id_user, inter];
			result = await db.query(sql, todo);
		}
	}
}

async function count_photo (id_user){
	var sql = "SELECT count(*) as 'count' FROM `photo` WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	if (result[0] == undefined) {
		return (0);
	}
	else {
		return (result[0].count);
	}
}

exports.get_info_user = async function (login){
	id_user = await get_id_user(login);
	var sql = "SELECT *, DATE_FORMAT(`birthday`, '%Y\\%m\\%d') as birth FROM `user_info` WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	return (result);
}


update_info_user_bis = async function (id_user, gender, orientation, bio, interests, birthday){
}

async  function is_info_user_exist (login){
	id_user = await get_id_user(login);
	var sql = "SELECT * FROM `user_info` WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	if (result[0] == undefined) {
		return (false);
	}
	else {
		return (true);
	}
}


exports.savePic = async function (id_user, path, profile){
	var sql = "INSERT INTO `photo` (`id_user`, `path_photo`, `profile`) VALUES (?, ?, ?);";
	var todo = [id_user, path, profile];
	result = await db.query(sql, todo);
}


exports.delPic = async function (path){
	var sql = "	DELETE FROM `photo` WHERE `path_photo` LIKE ?";
	var todo = [path];
	result = await db.query(sql, todo);
	if (error) throw error;
}

exports.profileToZero = async function (id_user){
	// console.log("Profile to zero");
	var sql = "UPDATE `photo` SET `profile`= 0 WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	if (error) throw error;
	return ("done");
}

exports.profileToOne = async function (path){
	var sql = "UPDATE `photo` SET `profile`= 1 WHERE `path_photo` LIKE ?";
	// console.log("finale path");
	// console.log(path);
	var todo = [path];
	result = await db.query(sql, todo);
	if (error) throw error;
	return ("done");
}

exports.isProfile = async function (path){
	var sql = "SELECT `profile` FROM `photo` WHERE `path_photo` LIKE ?";
	var todo = [path];
	result = await db.query(sql, todo);
	if (error) throw error;
	return (result);
}
