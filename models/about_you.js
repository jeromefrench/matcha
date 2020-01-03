exports.InfoUser = async function (login, property, field){
	var userExist = await is_info_user_exist(login);
	if (userExist){
		update_info_user(login, property, field);
	} else {
		insert_info_user(login, property, field);
	}
}

exports.count_photo = async function count_photo (id_user){
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

async function savePic (id_user, path, profile){
	var sql = "INSERT INTO `photo` (`id_user`, `path_photo`, `profile`) VALUES (?, ?, ?);";
	var todo = [id_user, path, profile];
	var result = await db.query(sql, todo);
}

async function get_info_user (login){
	var id_user = await get_id_user(login);
	var sql = "SELECT *, DATE_FORMAT(`birthday`, '%Y\\%m\\%d') as birth FROM `user_info` WHERE `id_user` = ?";
	var todo = [id_user];
	var result = await db.query(sql, todo);
	return (result);
}

async function getPic (id_user){
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

exports.get_id_user = async function (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return (result[0].id);
}

exports.profileToZero = async function (id_user){
	var sql = "UPDATE `photo` SET `profile`= 0 WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	return ("done");
}

exports.profileToOne = async function (path){
	var sql = "UPDATE `photo` SET `profile`= 1 WHERE `path_photo` LIKE ?";
	var todo = [path];
	result = await db.query(sql, todo);
	return ("done");
}

exports.isProfile = async function (path){
	var sql = "SELECT `profile` FROM `photo` WHERE `path_photo` LIKE ?";
	var todo = [path];
	result = await db.query(sql, todo);
	return (result);
}

exports.delPic = async function (path){
	var sql = "	DELETE FROM `photo` WHERE `path_photo` LIKE ?";
	var todo = [path];
	result = await db.query(sql, todo);
	return "done";
}

//******************************************************************************


exports.check_field_about_you = function (field){
	var check_field = {};

	check_field['gender'] = check_gender(field['gender']);
	check_field['orientation'] = check_orientation(field['orientation']);
	check_field['birthday'] = check_birthday(field['birthday']);
	check_field['bio'] = check_bio(field['bio']);
	check_field['interests'] = check_interests(field['interests']);
	return check_field;
}

exports.check_field_localisation = function (field, check_field){
	check_field['country'] = help_noempty(field['country']);
	check_field['city'] = help_noempty(field['city']);
	check_field['zip_code'] = help_noempty(field['zip_code']);
	check_field['localisation'] = check_localisation(check_field);
	return check_field;
}

function check_localisation(check_field){
	if (check_field['country'] == "ok" &&
		check_field['city'] == "ok" &&
		check_field['zip_code'] == "ok"){
		return "ok";
	}
	else{
		return "empty"
	}
}

function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return "empty";
	return "ok";
}

function check_gender(gender){
	check_field = help_noempty(gender);
	if (check_field == "ok" && gender != "male" && gender != "female" && gender != "other"){
		check_field = "wrong";
	}
	return check_field;
}

function check_orientation(orientation){
	check_field = help_noempty(orientation);
	if (check_field == "ok" && orientation != "everyone" && orientation != "women" && orientation != "men"){
		check_field = "wrong";
	}
	return check_field;
}

function check_birthday(birthday){
	check_field = help_noempty(birthday);

	if (check_field == "empty"){
		return check_field
	}
	else{
		var myRe = new RegExp('[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]', 'g');
		var bool = myRe.test(birthday);
		if (bool == true){
			return "ok"
		}
		else {
			return "wrong"
		}
	}
	return check_field;
}

function check_bio(bio){
	//check_field['bio'] = help_noempty(field['bio']); marche pas car espace
	if (bio != undefined && bio != ""){
		check_field = "ok";
	}
	else{
		check_field = "empty";
	}
	return check_field;
}

function check_interests(interests){
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

async function get_id_user (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return (result[0].id);
}

exports.get_photo = async function (login){
	id_login = await get_id_user(login);
	var sql = "SELECT * FROM `photos` WHERE `id_user` = ?";
	var todo = [id_login];
	result = await db.query(sql, todo);
	return (result);
}

exports.check_picture = function (files, login, number){
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

exports.isCompleted = async function (login){

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

exports.savethePic = async function (files, login, number){
	var profile = 0;
	if (number == 0){
		profile = 1;
	}
	name = rootPath+"/public/photo/"+login+"/"+number;
	files.photo.mv(name);
	done = await savePic(id_user, "/public/photo/"+login+"/"+number, profile)
	return done;
}

exports.get_info_user = async function (login){
	var user = await get_info_user(login);
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

exports.get_completed = async function (login){
	id_user = await get_id_user(login);
	var sql = "SELECT `completed` FROM `user_info` WHERE `id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	return (result[0]);
}
