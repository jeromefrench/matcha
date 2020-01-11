var bdd = require('../models/about_you.js');
var moment = require('moment');
var geodist = require('geodist');

exports.get_user = async function (login){
	try {
		var info_user = await bdd.get_info_user(login);
		info_user[0] = info_user;
		id_user = await bdd.get_id_user(login);
		if (info_user[0].orientation == 'women'){
			if (info_user[0].gender == 'male'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
			else if (info_user[0].gender == 'female'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
			else{
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
		}
		else if (info_user[0].orientation == 'men'){
			if (info_user[0].gender == 'male'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
			else if (info_user[0].gender == 'female'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
			else{
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
		}
		else {
			if (info_user[0].gender == 'male'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
			else if (info_user[0].gender == 'female'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
			else{
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1";
			}
		}
		var todo = [id_user, id_user];
		result = await db.query(sql, todo);
		return (result);
	}
	catch (err){
		return (err);
	}
}

exports.get_user_profile = async function (login){
	try {
		id_user = await bdd.get_id_user(login);
		var sql = "	SELECT *, `user`.`id` AS 'id_user', DATE_FORMAT(`last_visit`, '%d/%m/%Y') AS 'last_visit' FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`connection_log` ON `docker`.`user`.`id` = `docker`.`connection_log`.`id_user` WHERE `docker`.`user`.`id` = ? AND `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1";
		var todo = [id_user];
		result = await db.query(sql, todo);
		return (result);
	}
	catch (err){
		return (err);
	}
}

function dateur(debut, fin){
	try {
		var date_debut = moment().subtract(debut, 'years').calendar();
		var date = new Date(date_debut);
		date_debut = moment(date).format('YYYY-MM-DD');
		var date_fin = moment().subtract(fin, 'years').calendar();
		date = new Date(date_fin);
		date_fin = moment(date).format('YYYY-MM-DD');
		return (date_debut, date_fin);
	}
	catch (err){
		return (err);
	}
}

function dateur_debut(debut){
	try {
		var date_debut = moment().subtract(debut, 'years').calendar();
		var date = new Date(date_debut);
		date_debut = moment(date).format('YYYY-MM-DD');
		return date_debut;
	}
	catch (err){
		return (err);
	}
}

function dateur_fin(fin){
	try {
		var date_fin = moment().subtract(fin, 'years').calendar();
		date = new Date(date_fin);
		date_fin = moment(date).format('YYYY-MM-DD');
		return date_fin;
	}
	catch (err){
		return (err);
	}
}


function inter_rab(profile){
	try {
		var i = 0;
		var common_inter = 0;
		if (profile != undefined && profile.interests != undefined){
			profile.array_inter.forEach((element) => {
				i++;
				if (profile.interests.indexOf(element) > -1){
					common_inter++;
				}
			});
			if (i == profile.array_inter.length){
				return (common_inter);
			}
		}
		else{
			return null;
		}
	}
	catch (err){
		return (err);
	}
}

function inter_function(profile){
	try {
		bool = profile.nb_inter <= profile.nb_com;
		return bool;
	}
	catch (err){
		return (err);
	}
}

function pop_function(profile){
	try {
		bool = profile.popRequired <= profile.pop;
		return bool;
	}
	catch (err){
		return (err);
	}
}

exports.search = async function (user, search){
	try {
		var i = 0;
		var array_inter = [];
		//dateur(search.age_debut, search.age_fin, (debut, fin) => {

		var	debut = dateur_debut(search.age_debut);
		var fin  = dateur_fin(search.age_fin);


		if (user.orientation == 'women'){
			if (user.gender == 'male'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
			else if (user.gender == 'female'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
			else{
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'female' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
		}
		else if (user.orientation == 'men'){
			if (user.gender == 'male'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
			else if (user.gender == 'female'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
			else{
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`gender` = 'male' AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
		}
		else {
			if (user.gender == 'male'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'women' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
			else if (user.gender == 'female'){
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` != 'men' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
			else{
				var sql = "SELECT * FROM `docker`.`user_info` LEFT OUTER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` LEFT OUTER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` LEFT OUTER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user_info`.`id_user` WHERE `user`.`id` != ? AND `user_info`.`orientation` = 'everyone' AND `user_info`.`id_user` NOT IN (SELECT `id_block` FROM `block` WHERE `id_user` = ?) AND `docker`.`photo`.`profile` = 1 AND `birthday` BETWEEN ? AND ?";
			}
		}
		var todo = [user.id_user, user.id_user, fin, debut];
		var birthday = moment(user.birthday);
		user.age = -(birthday.diff(moment(), 'years'));
		if (user.interests.indexOf(',') == -1){
			array_inter[0] = user.interests;
		}
		else{
			array_inter = user.interests.split(',');
		}
		var result = await db.query(sql, todo);
		if(result == undefined || result[0] == undefined){
			return (result);
		}
		else{
			var dist_user = {lat: user.latitude, lon: user.longitude};
			result.forEach((profile) => {
				birthday = moment(profile.birthday);
				result[i].age = -(birthday.diff(moment(), 'years'));
				result[i].ecart = result[i].age - user.age;
				if (result[i].ecart < 0){
					result[i].ecart = -result[i].ecart;
				}
				result[i].popRequired = search.popularite;
				result[i].array_inter = array_inter;
				result[i].nb_inter = search.interet;
				var dist_profile = {lat: result[i].latitude, lon: result[i].longitude};
				var dist = geodist(dist_profile, dist_user, {unit: 'km'});
				result[i].distance = dist;
				result[i].distance_max = search.distance;
				var nb_com = inter_rab(result[i]);
				result[i].nb_com = nb_com;
				i++;
			});
			var filter_result = result.filter(distance_function);
			var filter_res = filter_result.filter(inter_function);
			filter_result = filter_res.filter(pop_function);
			var le_result = filter_result;
			return (le_result);
		}
	}
	catch (err){
		return (err);
	}
}



function distance_function(profile){
	try {
		bool = profile.distance <= profile.distance_max;
		return bool;
	}
	catch (err){
		return (err);
	}
}
