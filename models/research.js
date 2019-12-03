var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');
var moment = require('moment');
var geodist = require('geodist');

exports.get_user = function (login, callback){
	// SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1


		// var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user`";

	bdd.get_id_user(login, (id_user) => {
		var sql = "	SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1 AND `docker`.`user`.`id` != ?";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
		// conn.connection.query('SELECT * FROM `user` ', function (error, results, fields) {
		// 	// console.log(results);
		// 	callback(results);
		// });
	})
}


exports.get_user_profile = function (login, callback){
	bdd.get_id_user(login, (id_user) => {
		var sql = "	SELECT *, `user`.`id` AS 'id_user', DATE_FORMAT(`last_visit`, '%d/%m/%Y') AS 'last_visit' FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`connection_log` ON `docker`.`user`.`id` = `docker`.`connection_log`.`id_user` WHERE `docker`.`user`.`id` = ? AND `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	})
}

function dateur(debut, fin, callback){
	var date_debut = moment().subtract(debut, 'years').calendar();
	var date = new Date(date_debut);
	date_debut = moment(date).format('YYYY-MM-DD');
	var date_fin = moment().subtract(fin, 'years').calendar();
	date = new Date(date_fin);
	date_fin = moment(date).format('YYYY-MM-DD');
	callback(date_debut, date_fin);
}

function distance_function(profile){
	bool = profile.distance <= profile.distance_max;
	return bool;
}

function inter_rab(profile, callback){
	var i = 0;
	var common_inter = 0;
	profile.array_inter.forEach((element) => {
		i++;
		if (profile.interests.indexOf(element) > -1){
			common_inter++;
		}
		if (i == profile.array_inter.length){
			callback(common_inter);
		}
	});
}

function inter_function(profile){
	bool = profile.nb_inter <= profile.nb_com;
	return bool;
}

function pop_function(profile){
	bool = profile.popRequired <= profile.pop;
	return bool;
}

exports.search = function (user, search, callback){
	var i = 0;
	var array_inter = [];
	dateur(search.age_debut, search.age_fin, (debut, fin) => {
		var sql = "SELECT * FROM `docker`.`user_info` INNER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` INNER JOIN `popularite` ON `docker`.`popularite`.`id_user` = `docker`.`user`.`id` WHERE `birthday` BETWEEN ? AND ?";
		var todo = [fin, debut];
		var birthday = moment(user.birthday);
		user.age = -(birthday.diff(moment(), 'years'));
		if (user.interests.indexOf(',') == -1){
			array_inter[0] = user.interests;
		}
		else{
			array_inter = user.interests.split(',');
		}
		conn.connection.query(sql, todo, (err, result) => {
			if (err) throw err;
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
				inter_rab(profile, (nb_com) => {
					profile.nb_com = nb_com;
					if (i == result.length){
						var filter_result = result.filter(distance_function);
						var filter_res = filter_result.filter(inter_function);
						filter_result = filter_res.filter(pop_function);
						// filter_result = filter_result.filter(u => u.id == user.id);
						// if (user.orientation == 'women'){
						// 	filter_result = filter_result.filter(u => u.gender == 'female');
						// }
						// else if (user.orientation == 'men'){console.log("ORIENATION = " + user.orientation);
						// 	filter_result = filter_result.filter(u => u.gender == 'male');
						// }
						console.log(filter_result);
						callback(filter_result);
					}
				});
			});
		});
	});
}