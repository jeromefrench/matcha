var bdd = require('../models/about_you.js');
var moment = require('moment');
var geodist = require('geodist');

exports.get_user = async function (login){
	info_user = await bdd.get_info_user(login);
	id_user = await bdd.get_id_user(login);
	console.log('genre = ' + info_user[0].gender + '; orient = ' + info_user[0].orientation + '; id = ' + id_user);
	if (info_user[0].orientation == 'women'){
		if (info_user[0].gender == 'male'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
		else if (info_user[0].gender == 'female'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
		else{
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
	}
	else if (info_user[0].orientation == 'men'){
		if (info_user[0].gender == 'male'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
		else if (info_user[0].gender == 'female'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
		else{
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
	}
	else {
		if (info_user[0].gender == 'male'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
		else if (info_user[0].gender == 'female'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
		else{
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?)";
		}
	}
	var todo = [id_user, id_user];
	result = await db.query(sql, todo);
	console.log(result);
	return (result);
}


exports.get_user_profile = async function (login){
	id_user = await bdd.get_id_user(login);
	var sql = "	SELECT *, `user`.`id` AS 'id_user', DATE_FORMAT(`last_visit`, '%d/%m/%Y') AS 'last_visit' FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`connection_log` ON `docker`.`user`.`id` = `docker`.`connection_log`.`id_user` WHERE `docker`.`user`.`id` = ? AND `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1";
	var todo = [id_user];
	result = await db.query(sql, todo);
	return (result);
}

function dateur(debut, fin){
	var date_debut = moment().subtract(debut, 'years').calendar();
	var date = new Date(date_debut);
	date_debut = moment(date).format('YYYY-MM-DD');
	var date_fin = moment().subtract(fin, 'years').calendar();
	date = new Date(date_fin);
	date_fin = moment(date).format('YYYY-MM-DD');
	return (date_debut, date_fin);
}
function dateur_debut(debut){
	var date_debut = moment().subtract(debut, 'years').calendar();
	var date = new Date(date_debut);
	date_debut = moment(date).format('YYYY-MM-DD');
}

function dateur_fin(fin){
	var date_fin = moment().subtract(fin, 'years').calendar();
	date = new Date(date_fin);
	date_fin = moment(date).format('YYYY-MM-DD');
}

function distance_function(profile){
	bool = profile.distance <= profile.distance_max;
	return bool;
}

function inter_rab(profile){
	var i = 0;
	var common_inter = 0;
	if (profile != undefined && profile.interests != undefined){
		profile.array_inter.forEach((element) => {
			i++;
			if (profile.interests.indexOf(element) > -1){
				common_inter++;
			}
			if (i == profile.array_inter.length){
				return (common_inter);
			}
		});
	}
	else{
		return null;
	}
}

function inter_function(profile){
	bool = profile.nb_inter <= profile.nb_com;
	return bool;
}

function pop_function(profile){
	bool = profile.popRequired <= profile.pop;
	return bool;
}

exports.search = async function (user, search){
	var i = 0;
	var array_inter = [];
	//dateur(search.age_debut, search.age_fin, (debut, fin) => {


		debut = dateur_debut(search.age_debut);
		fin  = dateur_fin(search.age_fin);



	if (user.orientation == 'women'){
		if (user.gender == 'male'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
		else if (user.gender == 'female'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
		else{
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
	}
	else if (user.orientation == 'men'){
		if (user.gender == 'male'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
		else if (user.gender == 'female'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
		else{
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
	}
	else {
		if (user.gender == 'male'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
		else if (user.gender == 'female'){
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
		else{
			var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = '1')AND `birthday` BETWEEN ? AND ?";
		}
	}
	var todo = [user.id_user, fin, debut];
	var birthday = moment(user.birthday);
	user.age = -(birthday.diff(moment(), 'years'));
	if (user.interests.indexOf(',') == -1){
		array_inter[0] = user.interests;
	}
	else{
		array_inter = user.interests.split(',');
	}
	resutl = await db.query(sql, todo);
	if(result == undefined || result[0] == undefined){
		return (result);
	}
	else{
		var dist_user = {lat: user.latitude, lon: user.longitude};
		result.forEach((profile) => {
			i++;
			birthday = moment(profile.birthday);
			profile.age = -(birthday.diff(moment(), 'years'));
			profile.ecart = profile.age - user.age;
			if (profile.ecart < 0){profile.ecart = -profile.ecart;}
			profile.popRequired = search.popularite;
			profile.array_inter = array_inter;
			profile.nb_inter = search.interet;
			var dist_profile = {lat: profile.latitude, lon: profile.longitude};
			var dist = geodist(dist_profile, dist_user, {unit: 'km'});
			profile.distance = dist;
			profile.distance_max = search.distance;
			nb_com = inter_rab(profile);
			profile.nb_com = nb_com;
			if (i == result.length){
				var filter_result = result.filter(distance_function);
				var filter_res = filter_result.filter(inter_function);
				filter_result = filter_res.filter(pop_function);
				console.log(filter_result);
				return (filter_result);
			}
		});
	}
}
