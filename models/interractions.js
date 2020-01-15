var dash = require('../models/dashboard.js');

exports.add_visited_profile = async function (my_login, login_i_visit){
	try {
		var my_id = await get_id_user(my_login);
		var id_i_visit = await get_id_user(login_i_visit);
		var sql = "SELECT * FROM `visited` WHERE `id_user` = ? AND `id_visited` = ? ";
		var todo = [my_id, id_i_visit];
		var result = await db.query(sql, todo);
		if (result[0] == undefined) {
			sql = "INSERT INTO `visited` (`id`, `id_user`, `id_visited`) VALUES (NULL, ?, ?)";
			todo = [my_id, id_i_visit];
			result = await db.query(sql, todo);
			return ("done");
		}else {
			return ("done");
		}
	}
	catch (err){
		return (err);
	}
}

exports.get_user = async function (a){
	try {
		var results = await db.query('SELECT * FROM `user` ');
		return (results);
	}
	catch (err){
		return (err);
	}
}

exports.doesItLikeMe = async function (my_login, the_login_i_search){
	try {
		var my_id = await get_id_user(my_login);
		var id_i_like = await get_id_user(the_login_i_search);
		var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
		var todo = [id_i_like, my_id];
		var result = await db.query(sql, todo);
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

exports.doILike = async function (my_login, the_login_i_search){
	try {
		var my_id = await get_id_user(my_login);
		var id_i_like = await get_id_user(the_login_i_search);
		var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
		var todo = [my_id, id_i_like];
		var result = await db.query(sql, todo);
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

exports.addLike = async function (my_login, the_login_i_like){
	try {
		var my_id = await get_id_user(my_login);
		var id_i_like = await get_id_user(the_login_i_like);
		var sql = "INSERT INTO `like_table` (id_user, id_i_like) VALUES (?, ?)";
		var todo = [my_id, id_i_like];
		var result = await db.query(sql, todo);
		sql = "UPDATE `popularite` SET `nb_like` = `nb_like` + 1 WHERE `id_user` = ?";
		todo = [id_i_like];
		result = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
};

exports.unLike = async function (my_login, the_login_i_like){
	try {
		var my_id = await get_id_user(my_login);
		var id_i_like = await get_id_user(the_login_i_like);
		var sql = "DELETE FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
		var todo = [my_id, id_i_like];
		var result = await db.query(sql, todo);
		sql = "UPDATE `popularite` SET `nb_like` = `nb_like` - 1 WHERE `id_user` = ?";
		todo = [id_i_like];
		result = await db.query(sql, todo);	}
	catch (err){
		return (err);
	}
};

async function getVue (id_user){
	try {
		var sql = "SELECT * FROM `vue_profile` WHERE `id_user` = ?";
		var todo = [id_user];
		var profile = await db.query(sql, todo);
		return (profile[0].vue);
	}
	catch (err){
		return (err);
	}
}

exports.countVue = async function (login){
	try {
		var sql = "SELECT * FROM `user` WHERE `login` = ?";
		var todo = [login];
		var user = await db.query(sql, todo);
		var id_user = user[0].id;
		var sql = "SELECT COUNT(*) AS 'count' FROM `vue_profile` WHERE `id_user` = ?";
		todo = [id_user];
		var countId = await db.query(sql, todo);
		if (countId[0].count == 0){
			sql = "INSERT INTO `vue_profile` (`id_user`) VALUES (?)";
			todo = [id_user];
			done = await db.query(sql, todo);
			sql = "UPDATE `vue_profile` SET `vue` = `vue` + 1 WHERE `id_user` = ?";
			todo = [id_user];
			done = await db.query(sql, todo);
			nbVue = await getVue(id_user);
			return (nbVue);
		}
		else{
			sql = "UPDATE `vue_profile` SET `vue` = `vue` + 1 WHERE `id_user` = ?";
			todo = [id_user];
			done = db.query(sql, todo);
			nbVue = await getVue(id_user);
			return (nbVue);
		}
	}
	catch (err){
		return (err);
	}
}

exports.countLike = async function (login){
	try {
		var sql = "SELECT * FROM `user` WHERE `login` = ?";
		var todo = [login];
		var user = await db.query(sql, todo);
		if (user == undefined || user[0] == undefined ){
			return 0;
		}
		else{
			var id_user = user[0].id;
			sql = "SELECT * FROM `popularite` WHERE `id_user` = ?";
			todo = [id_user];
			result = await db.query(sql, todo);
			return (result[0].nb_like);
		}
	}
	catch (err){
		return (err);
	}
}

exports.addLikeVue = async function(id_user, countLike, nbVue){
	try {

		var sql = "SELECT COUNT(*) AS 'count' FROM `popularite` WHERE `id_user` = ?";
		var todo = [id_user];
		var pop = Math.round((countLike / nbVue) * 5);
		var result = await db.query(sql, todo);
		console.log("ADDLV RESULT");
		console.log(result[0]);
		if (result[0].count == 0){
			sql = "INSERT INTO `popularite` (`id_user`, `nb_like`, `nb_vue`, `pop`) VALUES (?, ?, ?, ?)";
			todo = [id_user, countLike, nbVue, pop];
			done = await db.query(sql, todo);
			sql = "SELECT * FROM `popularite` WHERE `id_user` = ?";
			todo = [id_user];
			result = await db.query(sql, todo);
			console.log("RESULT POP");
			console.log(result[0]);
			return (result[0].pop);
		}
		else{
			console.log("COUNT ADDLV");
			console.log(countLike);
			console.log("NB VUE");
			console.log(nbVue);
			console.log("ID USER ADDLV");
			console.log(id_user);
			sql = "UPDATE `popularite` SET `nb_like` = ?, `nb_vue` = ?, `pop` = ? WHERE `id_user` = ?";
			todo = [countLike, nbVue, pop, id_user];
			done = await db.query(sql, todo);
			sql = "SELECT * FROM `popularite` WHERE `id_user` = ?";
			todo = [id_user];
			result = await db.query(sql, todo);
			console.log("RESULT POP");
			console.log(result[0]);
			if (result && result[0]){
				return (result[0].pop);
			}
			else
				return null;
		}
	}
	catch (err){
		return (err);
	}
}

exports.block_user = async function(user_log, user_block){
	try {
		var id_log = await get_id_user(user_log);
		var id_block = await get_id_user(user_block);
		var sql = "INSERT INTO `block` (`id_user`, `id_block`) VALUES (?, ?)";
		var todo = [id_log, id_block];
		done = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

exports.IdBlocked = async function(tab, id_user, id_block){
	try {
		var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
		var todo = [id_user, id_block];
		var result = await db.query(sql, todoJ);
		if (result[0].count > 0){
			tab = tab.filter(u => u.id_user !== id_block);
		}
	}
	catch (err){
		return (err);
	}
}

exports.recover_user = async function  (login){
	try {
		var sql = "SELECT *, `user`.`id` AS 'id_user' FROM `user` INNER JOIN `user_info` ON `user`.`id` = `user_info`.`id_user` WHERE `login` LIKE ?";
		var todo = [login];
		results = await db.query(sql, todo);
		return (results);
	}
	catch (err){
		return (err);
	}
}

exports.IsBlocked = async function(user_log, user_block){
	try {
		id_log = await get_id_user(user_log);
		id_block = await get_id_user(user_block);
		var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
		var todo = [id_log, id_block];
		result = await db.query(sql, todo);
		if (result[0].count > 0){
			return (true);
		}
		else{
			return (false);
		}
	}
	catch (err){
		return (err);
	}
}

async function get_id (login){
	try {
		var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		result = await db.query(sql, todo);
		return (result);
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

async function insert_message (content, date){
	try {
		var sql = "INSERT INTO messages (content, createat) VALUES (?, ?)";
		var todo = [content, date];
		result = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

module.exports.insert_log  = insert_log ;
async function insert_log (id_user){
	try {
		var  sql = 'INSERT INTO `connection_log` (`id_user`, `last_visit`) VALUES (?, ?)';
		date = new Date();
		var todo = [id_user, date];
		results = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

async function getRandomInt(max){
	try {
		var nbr =  Math.floor(Math.random() * Math.floor(max));
		return nbr;
	}
	catch (err){
		return (err);
	}
}

module.exports.add_fakeVueLike  = add_fakeVueLike ;
async function add_fakeVueLike (id_user){
	try{
		var vue = await getRandomInt(1000);
		if (vue == 0){
			vue = 1;
		}
		var like = await getRandomInt(vue);
		var pop = (like / vue) * 5;
		var sql = "INSERT INTO `vue_profile` (`id_user`, `vue`) VALUES (?, ?)";
		var todo = [id_user, vue];
		var done = await db.query(sql, todo);
		sql = "INSERT INTO `popularite` (`id_user`, `nb_like`, `nb_vue`, `pop`) VALUES (?, ?, ?, ?)";
		todo = [id_user, like, vue, pop];
		done = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

exports.add_faker = async function(user_log, user_fake){
	try {
		var id_log = await get_id_user(user_log);
		var id_fake = await get_id_user(user_fake);
		var sql = "INSERT INTO `report_fake` (`id_user`, `id_faker`) VALUES (?, ?)";
		var todo = [id_log, id_fake];
		done = db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

exports.IsReport = async function(user_log, user_fake){
	try {
		var id_log = await get_id_user(user_log);
		var id_fake = await get_id_user(user_fake);
		var sql = "SELECT COUNT(*) AS 'count' FROM `report_fake` WHERE `id_user` = ? AND `id_faker` = ?";
		var todo = [id_log, id_fake];
		var result = await db.query(sql, todo);
		if (result[0].count > 0){
			return (true);
		}
		else{
			return (false);
		}
	}
	catch (err){
		return (err);
	}
}

exports.updateMatch = async function(userLog, ismatchLog){
	try {
		var userId = await get_id_user(userLog);
		var ismatchId = await get_id_user(ismatchLog);
		var matches = await dash.get_user_my_match(userLog);
		var sql = "UPDATE `like_table` SET `match` = ? WHERE `id_user` = ? AND `id_i_like` = ?";
		var find = matches.find(element => element.id == ismatchId);
		if (find != undefined){
			var todo = [1, userId, ismatchId];
		}
		else {
			var todo = [0, userId, ismatchId];
		}
		done = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

