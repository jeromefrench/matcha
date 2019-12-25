var dash = require('../models/dashboard.js');

exports.add_visited_profile = async function (my_login, login_i_visit){
	my_id = await get_id_user(my_login);
	id_i_visit = await get_id_user(login_i_visit);
	var sql = "SELECT * FROM `visited` WHERE `id_user` = ? AND `id_visited` = ? ";
	var todo = [my_id, id_i_visit];
	result = await db.query(sql, todo);
	console.log("Result visited");
	console.log(result);
	if (result[0] == undefined) {//on ajoute dans la base la visit
		console.log(my_id);
		console.log(id_i_visit);
		var sql = "INSERT INTO `visited` (`id`, `id_user`, `id_visited`) VALUES (NULL, ?, ?)";
		var todo = [my_id, id_i_visit];
		result = await db.query(sql, todo);
		return ("done");
	}else {
		//pas besoin
		return ("done");
	}
}

exports.get_user = async function (a){
	results = await db.query('SELECT * FROM `user` ');
	return (results);
}

exports.doesItLikeMe = async function (my_login, the_login_i_search){
	my_id = await get_id_user(my_login);
	id_i_like = await get_id_user(the_login_i_search);
	//verifier si on a pas deja liker cette personne
	// console.log("my id " + my_id);
	// console.log("the id i like" + id_i_like);
	var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
	var todo = [id_i_like, my_id];
	result = await db.query(sql, todo);
	if (result[0] == undefined) {
		return (false);
	}
	else {
		return (true);
	}
}

exports.doILike = async function (my_login, the_login_i_search){
	my_id = await get_id_user(my_login);
	id_i_like = await get_id_user(the_login_i_search);
	//verifier si on a pas deja liker cette personne
	// console.log("my id " + my_id);
	// console.log("the id i like" + id_i_like);
	var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
	var todo = [my_id, id_i_like];
	result = db.query(sql, todo);
	if (result[0] == undefined) {
		return (false);
	}
	else {
		return (true);
	}
}

exports.addLike = async function (my_login, the_login_i_like){
	my_id = await get_id_user(my_login);
	id_i_like = await get_id_user(the_login_i_like);
	var sql = "INSERT INTO `like_table` (id_user, id_i_like) VALUES (?, ?)";
	var todo = [my_id, id_i_like];
	result = await db.query(sql, todo);
};

exports.unLike = async function (my_login, the_login_i_like){
	my_id = await get_id_user(my_login);
	id_i_like = await get_id_user(the_login_i_like);
	var sql = "DELETE FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
	var todo = [my_id, id_i_like];
	result = await db.query(sql, todo);
	console.log("infos removed");
};

async function getVue (id_user){
	var sql = "SELECT * FROM `vue_profile` WHERE `id_user` = ?";
	var todo = [id_user];
	profile = await db.query(sql, todo);
	return (profile[0].vue);
}

exports.countVue = async function (login){
	var sql = "SELECT * FROM `user` WHERE `login` = ?";
	var todo = [login];
	user = await db.query(sql, todo);
	var id_user = user[0].id;
	sql = "SELECT COUNT(*) AS 'count' FROM `vue_profile` WHERE `id_user` = ?";
	todo = [id_user];
	countId = await db.query(sql, todo);
	if (countId[0].count == 0){
		sql = "INSERT INTO `vue_profile` (`id_user`) VALUES (?)";
		todo = [id_user];
		done = await db.query(sql, todo);
		console.log("id added !");
		sql = "UPDATE `vue_profile` SET `vue` = `vue` + 1 WHERE `id_user` = ?";
		todo = [id_user];
		done = await db.query(sql, todo);
		console.log("vue UPDATED for" + id_user);
		nbVue = await getVue(id_user);
		return (nbVue);
	}
	else{
		sql = "UPDATE `vue_profile` SET `vue` = `vue` + 1 WHERE `id_user` = ?";
		todo = [id_user];
		done = db.query(sql, todo);
		console.log("vue updated for" + id_user);
		nbVue = await getVue(id_user);
		return (nbVue);
	}
}

exports.countLike = async function (login){
	var sql = "SELECT * FROM `user` WHERE `login` = ?";
	var todo = [login];
	user = db.query(sql, todo);
	var id_user = user[0].id;
	sql = "SELECT COUNT(*) AS 'count' FROM `like_table` WHERE `id_i_like` = ?";
	todo = [id_user];
	like = await db.query(sql, todo);
	return (like[0].count);
}

exports.addLikeVue = async function(id_user, countLike, nbVue){
	var sql = "SELECT COUNT(*) AS 'count' FROM `popularite` WHERE `id_user` = ?";
	var todo = [id_user];
	var pop = Math.round((countLike / nbVue) * 5);
	result = await db.query(sql, todo);
	if (result[0].count == 0){
		sql = "INSERT INTO `popularite` (`id_user`, `nb_like`, `nb_vue`, `pop`) VALUES (?, ?, ?, ?)";
		todo = [id_user, countLike, nbVue, pop];
		done.query(sql, todo);
		console.log("pop inserted");
		sql = "SELECT * FROM `popularite` WHERE `id_user` = ?";
		todo = [id_user];
		result = db.query(sql, todo);
		return (result[0].pop);
	}
	else{
		sql = "UPDATE `popularite` SET `nb_like` = ? AND `nb_vue` = ? AND `pop` = ? WHERE `id_user` = ?";
		todo = [countLike, nbVue, pop, id_user];
		done = await db.query(sql, todo);
		console.log('pop updated');
		sql = "SELECT * FROM `popularite` WHERE `id_user` = ?";
		todo = [id_user];
		result = await db.query(sql, todo);
		if (result && result[0]){
			return (result[0].pop);
		}
		else
			return null;
	}
}

exports.updateMatch = async function(userLog, ismatchLog){
	userId = await get_id_user(userLog);
	ismatchId = await get_id_user(ismatchLog);
	matches = await dash.get_user_my_match(userLog);
	var sql = "UPDATE `like_table` SET `match` = ? WHERE `id_user` = ? AND `id_i_like` = ?";
	var find = matches.find(element => element.id == ismatchId);
	if (find != undefined){
		var todo = [1, userId, ismatchId];
	}
	else {
		var todo = [0, userId, ismatchId];
	}
	done = await db.query(sql, todo);
	console.log("match on like table UPDATED");
}

exports.wasMatch = async function(userLog, wasmatchLog){
	userId = await get_id_user(userLog);
	wasmatchId = await get_id_user(wasmatchLog);
	var sql = "SELECT * FROM `like_table` WHERE `id_user` = ? AND `id_i_like` = ?";
	var todo = [userId, wasmatchId];
	result = await db.query(sql, todo);
	return (result[0]);
}

//block

exports.block_user = async function(user_log, user_block){
    id_log = await get_id_user(user_log);
    id_block = await get_id_user(user_block);
    var sql = "INSERT INTO `block` (`id_user`, `id_block`) VALUES (?, ?)";
    var todo = [id_log, id_block];
    done = await db.query(sql, todo);
    console.log('UTILISATEUR BLOQUE');
}

exports.IdBlocked = async function(tab, id_user, id_block){
    var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
    var todo = [id_user, id_block];
    result = await db.query(sql, todoJ);
    if (result[0].count > 0){
        tab = tab.filter(u => u.id_user !== id_block);
        console.log("apres");
        console.log(tab);
    }
}

exports.recover_user = async function  (login){
	var sql = "SELECT *, `user`.`id` AS 'id_user' FROM `user` INNER JOIN `user_info` ON `user`.`id` = `user_info`.`id_user` WHERE `login` LIKE ?";
	var todo = [login];
	results = await db.query(sql, todo);
	return (results);
}
exports.IsBlocked = async function(user_log, user_block){
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

//bdd_functions
async function get_id (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return (result);
}

async function get_id_user (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return (result[0].id);
}

async function insert_message (content, date){
	var sql = "INSERT INTO messages (content, createat) VALUES (?, ?)";
	var todo = [content, date];
	result = await db.query(sql, todo);
	console.log("1 record inserted");
}


async function insert_log (id_user){
	var  sql = 'INSERT INTO `connection_log` (`id_user`, `last_visit`) VALUES (?, ?)';
	date = new Date();
	var todo = [id_user, date];
	results = await db.query(sql, todo);
}

async function getRandomInt(max){
	return Math.floor(Math.random() * Math.floor(max));
}

async function add_fakeVueLike (id_user){
	var vue = getRandomInt(1000);
	if (vue == 0){vue = 1;}
	var like = getRandomInt(vue);
	var pop = (like / vue) * 5;
	var sql = "INSERT INTO `vue_profile` (`id_user`, `vue`) VALUES (?, ?)";
	var todo = [id_user, vue];
	done = await db.query(sql, todo);
	console.log("fake vue inserted");
	sql = "INSERT INTO `popularite` (`id_user`, `nb_like`, `nb_vue`, `pop`) VALUES (?, ?, ?, ?)";
	todo = [id_user, like, vue, pop];
	done = await db.query(sql, todo);
	console.log("fake pop inserted");
}
