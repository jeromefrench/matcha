module.exports.InfoUser = InfoUser;
module.exports.count_photo  = count_photo ;
module.exports.profileToZero  = profileToZero ;
module.exports.get_id_user  = get_id_user ;
module.exports.profileToOne  = profileToOne ;
module.exports.isProfile  = isProfile ;
module.exports.delPic  = delPic ;
module.exports.get_photo  = get_photo ;
module.exports.check_field_about_you   = check_field_about_you  ;
module.exports.check_field_localisation   = check_field_localisation  ;
module.exports.check_picture   = check_picture  ;
module.exports.isCompleted  = isCompleted ;
module.exports.savethePic  = savethePic ;
module.exports.get_info_user  = get_info_user ;
module.exports.get_completed  = get_completed ;
module.exports.insert_info_user  = insert_info_user ;
module.exports.savePic  = savePic ;
module.exports.update_info_user  = update_info_user ;
module.exports.isPhotoExist  = isPhotoExist ;
var moment = require('moment');

async function InfoUser (login, property, field){
	try {
		var userExist = await is_info_user_exist(login);
		if (userExist){
			update_info_user(login, property, field);
		} else {
			insert_info_user(login, property, field);
		}
	}
	catch (err){
		return (err);
	}
}

async function count_photo (id_user){
	try {
		var sql = "SELECT count(*) as 'count' FROM `photo` WHERE `id_user` = ?";
		var todo = [id_user];
		var result = await db.query(sql, todo);
		if (result[0] == undefined) {
			return (0);
		}
		else {
			return (result[0].count);
		}
	}
	catch (err){
		return (err);
	}
}

async function savePic (id_user, path, profile){
	try {
		var sql = "INSERT INTO `photo` (`id_user`, `path_photo`, `profile`) VALUES (?, ?, ?);";
		var todo = [id_user, path, profile];
		var result = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}


async function getPic (id_user){
	try {
		var sql = "SELECT * FROM `photo` WHERE `id_user` = ?";
		var todo = [id_user];
		var result = await db.query(sql, todo);
		if (result[0] == undefined) {
			return (false);
		}
		else {
			return (result);
		}
	}
	catch (err){
		return (err);
	}
}

async function get_id_user (login){
	try {
		var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		result = await db.query(sql, todo);
		return (result[0].id);
	}
	catch (err){
		return (err);
	}
}

async function profileToZero (id_user){
	try {
		var sql = "UPDATE `photo` SET `profile`= 0 WHERE `id_user` = ?";
		var todo = [id_user];
		result = await db.query(sql, todo);
		return ("done");
	}
	catch (err){
		return (err);
	}
}

async function profileToOne (path){
	try {
		var sql = "UPDATE `photo` SET `profile`= 1 WHERE `path_photo` LIKE ?";
		var todo = [path];
		result = await db.query(sql, todo);
		return ("done");
	}
	catch (err){
		return (err);
	}
}


async function isPhotoExist (path){
	try {
		var sql = "SELECT * FROM `photo` WHERE `path_photo` LIKE ?";
		var todo = [path];
		result = await db.query(sql, todo);
		if (result[0] == undefined) {
			return false;
		}
		else {
			return true;
		}
	}
	catch (err){
		return (err);
	}
}


async function isProfile (path){
	try {
		var sql = "SELECT `profile` FROM `photo` WHERE `path_photo` LIKE ?";
		var todo = [path];
		result = await db.query(sql, todo);
		return (result);
	}
	catch (err){
		return (err);
	}
}

async function delPic (path){
	try {
		var sql = "	DELETE FROM `photo` WHERE `path_photo` LIKE ?";
		var todo = [path];
		result = await db.query(sql, todo);
		return "done";
	}
	catch (err){
		return (err);
	}
}

function check_field_about_you (field){
	try {
		var check_field = {};

		check_field['gender'] = check_gender(field['gender']);
		check_field['orientation'] = check_orientation(field['orientation']);
		check_field['birthday'] = check_birthday(field['birthday']);
		check_field['bio'] = check_bio(field['bio']);
		check_field['interests'] = check_interests(field['interests']);
		return check_field;
	}
	catch (err){
		return (err);
	}
}

function check_field_localisation (field, check_field){
	try {
		check_field['country'] = help_noempty(field['country']);
		check_field['city'] = help_noempty(field['city']);
		check_field['zip_code'] = help_noempty(field['zip_code']);
		check_field['localisation'] = check_localisation(check_field);
		return check_field;
	}
	catch (err){
		return (err);
	}
}

function check_localisation(check_field){
	try {
		if (check_field['country'] == "ok" &&
			check_field['city'] == "ok" &&
			check_field['zip_code'] == "ok"){
			return "ok";
		}
		else{
			return "empty"
		}
	}
	catch (err){
		return (err);
	}
}

function help_noempty(champs){
	try {
		if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
			return "empty";
		return "ok";
	}
	catch (err){
		return (err);
	}
}

function check_gender(gender){
	try {
		check_field = help_noempty(gender);
		if (check_field == "ok" && gender != "male" && gender != "female" && gender != "other"){
			check_field = "wrong";
		}
		return check_field;
	}
	catch (err){
		return (err);
	}
}

function check_orientation(orientation){
	try {
		check_field = help_noempty(orientation);
		if (check_field == "ok" && orientation != "everyone" && orientation != "women" && orientation != "men"){
			check_field = "wrong";
		}
		return check_field;
	}
	catch (err){
		return (err);
	}
}

function check_birthday(birthday){
	try {
		check_field = help_noempty(birthday);

		if (check_field == "empty"){
			return check_field
		}
		else{
			var myRe = new RegExp('[0-9]{2}/[0-9]{2}/[0-9]{4}', 'g');
			var bool = myRe.test(birthday);
			if (bool == true){
				var birth = moment(birthday);
				var age = -(birth.diff(moment(), 'years'));
				if (age < 18 && age > 0){
					return "too_young";
				}
				else if (age <= 0){
					return "wrong";
				}
				return "ok";
			}
			else {
				return "wrong";
			}
		}
		return check_field;
	}
	catch (err){
		return (err);
	}
}

function check_bio(bio){
	try {
		if (bio != undefined && bio != ""){
			check_field = "ok";
		}
		else{
			check_field = "empty";
		}
		return check_field;
	}
	catch (err){
		return (err);
	}
}

function check_interests(interests){
	try {
		var array = Array.isArray(interests);
		var check_field = "ok";
		var check_inter;
		if (array == true) {
			interests.forEach((inter) => {
				check_inter = help_noempty(inter);
				if (check_field == "ok" && check_inter == "ok" &&
					inter != "voyage" &&
					inter != "cuisine" &&
					inter != "escalade" &&
					inter != "equitation" &&
					inter != "soleil" &&
					inter != "sieste"){
					check_field = "wrong";
				}
			});
		}
		else{
			check_field = help_noempty(interests);
			if (check_field == "ok" &&
				interests != "voyage" &&
				interests != "cuisine" &&
				interests != "escalade" &&
				interests != "equitation" &&
				interests != "soleil" &&
				interests != "sieste"){
				check_field = "wrong";
			}
		}
		return check_field;
	}
	catch (err){
		return (err);
	}
}

async function get_id_user (login){
	try {
		var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		result = await db.query(sql, todo);
		return (result[0].id);
	}
	catch (err){
		return (err);
	}
}

async function get_photo (login){
	try {
		id_login = await get_id_user(login);
		var sql = "SELECT * FROM `photos` WHERE `id_user` = ?";
		var todo = [id_login];
		result = await db.query(sql, todo);
		return (result);
	}
	catch (err){
		return (err);
	}
}

function check_picture (files, login, number){
	try {
		var check_pic = "ok";
		if ((files == undefined || files.photo == undefined || files.photo.size == 0) && number == 0){
			check_pic = "no_pic_uploaded";
		}
		else if (files == undefined || files.photo == undefined || files.photo.size == 0){
			check_pic = "nothing";
		}
		else if (files.photo.mimetype != "image/jpeg"){
			check_pic = "wrong_format";
		}
		else if (number > 4){
			check_pic = "photo_exed_5";
		}
		return check_pic;
	}
	catch (err){
		return (err);
	}
}

async function isCompleted (login){
	try {

		var userExist = await is_info_user_exist(login);
		var id_user = await get_id_user(login);


		if (userExist == true) {
			var sql = "UPDATE `user_info` SET `completed` = 1 WHERE `id_user` = ?";
			var todo = [id_user];
			result = await db.query(sql, todo);
		}
		else{
			var sql = "INSERT INTO `user_info` ( `completed`,  `id_user`) VALUES (?, ?)";
			var todo = [id_user];
			result = await db.query(sql, todo);
		}

	}
	catch (err){
		return (err);
	}
}

async function update_info_user (login, property, field){
	try {
		if (property != "interests"){
			var id_user = await get_id_user(login);
			var sql = "UPDATE `user_info` SET `"+property+"` = ? WHERE `id_user` = ?";
			var todo = [field, id_user];
			result = await db.query(sql, todo);
		}
		else{
			var id_user = await get_id_user(login);
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
	catch (err){
		return (err);
	}
}

async function insert_info_user (login, property, field){
	try {
		if (property != "interests"){
			var id_user = await get_id_user(login);
			var sql = "INSERT INTO `user_info` (`id_user`, `"+property+"`) VALUES (?, ?);";
			var todo = [id_user, field];
			result = await db.query(sql, todo);
		}
		else
		{
			var id_user = await get_id_user(login);
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
	catch (err){
		return (err);
	}
}

async function count_photo (id_user){
	try {
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
	catch (err){
		return (err);
	}
}

async  function is_info_user_exist (login){
	try {
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
	catch (err){
		return (err);
	}
}

async function savethePic (files, login, number){
	try {
		var profile = 0;
		if (number == 0){
			profile = 1;
		}
		name = rootPath+"/public/photo/"+login+"/"+number;
		files.photo.mv(name);
		done = await savePic(id_user, "/public/photo/"+login+"/"+number, profile)
		return done;
	}
	catch (err){
		return (err);
	}
}
async function get_the_info_user (login){
	try {
		var id_user = await get_id_user(login);
		var sql = "SELECT *, DATE_FORMAT(`birthday`, '%Y\\%m\\%d') as birth FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_user];
		var result = await db.query(sql, todo);
		return (result);
	}
	catch (err){
		return (err);
	}
}

async function get_info_user (login){
	try {
		var user = await get_the_info_user(login);
		user = user[0];
		for (const property in user){
			if(user[property] != null){
				user[property] = user[property];
			}
			else{
				user[property] = false;
			}
		}
		if (user != undefined && user.birth != undefined && user.birth != false)
		{
			user.birthday = user.birth;
			user.birthday = user.birthday.replace("\\", "/");
			user.birthday = user.birthday.replace("\\", "/");
			user.birthday = user.birthday.replace("\\", "/");
			user.birthday = user.birthday.split("/");
			user.birthday = user.birthday[1]+ "/"+ user.birthday[2]+"/"+user.birthday[0];
		}
		if (user != undefined && user.interests != false){
			user.interests = user.interests.split(",");
		}
		id_user = await get_id_user(login);
		pic = await getPic(id_user);
		if (user == undefined)
		{
			user = {};
		}
		if (pic != false){
			user.pic = pic;
		}
		return user;
	}
	catch (err){
		return (err);
	}
}

async function get_completed (login){
	try {
		id_user = await get_id_user(login);
		var sql = "SELECT `completed` FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_user];
		result = await db.query(sql, todo);
		return (result[0]);
	}
	catch (err){
		return (err);
	}
}
