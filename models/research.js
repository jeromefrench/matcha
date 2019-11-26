var conn = require('./connection_bdd.js');
let bdd = require('../models/bdd_functions.js');
var moment = require('moment');
var geodist = require('geodist');

exports.get_user = function (login, callback){
	// SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1


		// var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user`";

	bdd.get_id_user(login, (id_user) => {
		var sql = "	SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1";
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
		var sql = "	SELECT *, DATE_FORMAT(`last_visit`, '%d/%m/%Y') AS 'last_visit' FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`connection_log` ON `docker`.`user`.`id` = `docker`.`connection_log`.`id_user` WHERE `docker`.`user`.`id` = ? AND `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1";
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

exports.search = function (user, search, callback){
	var i = 0;
	dateur(search.age_debut, search.age_fin, (debut, fin) => {
		var sql = "SELECT * FROM `docker`.`user_info` INNER JOIN `docker`.`photo` ON `docker`.`user_info`.`id_user` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`user` ON `docker`.`user_info`.`id_user` = `docker`.`user`.`id` WHERE `birthday` BETWEEN ? AND ?";
		var todo = [fin, debut];
		conn.connection.query(sql, todo, (err, result) => {
			if (err) throw err;
			var dist_user = {lat: user.latitude, lon: user.longitude};
			result.forEach((profile) => {
				i++;
				var dist_profile = {lat: profile.latitude, lon: profile.longitude};
				var dist = geodist(dist_profile, dist_user, {unit: 'km'});
				profile.distance = dist;
				profile.distance_max = search.distance;
				if (i == result.length){
					var filter_result = result.filter(distance_function);
					callback(filter_result);
				}
			});
		});
	});
}