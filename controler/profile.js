"use strict";
let bdd_re = require('../models/research.js');
let bdd = require('../models/interractions.js');
var bdd_notif = require('../models/notifications.js');
var bdd_a = require('../models/account.js');
const router = require('express').Router();

router.route('/:login').get(async (req, res) => {
	try {
		var id_user = await bdd_a.get_id_user(req.params.login);
		if (id_user == undefined){
			throw err;
		}
		var field = {};
		field['profil'] = req.params.login;
		var done = await bdd.add_visited_profile(req.session.login, field['profil']);
		field['do_i_like'] = await bdd.doILike(req.session.login, field['profil']);
		field['doesItLikeMe'] = await bdd.doesItLikeMe(req.session.login, field['profil']);
		field['count_like'] = await bdd.countLike(field['profil']);
		field['nbVue'] = await bdd.countVue(field['profil']);
		field['report'] = await bdd.IsReport(req.session.login, field['profil']);
		field['block'] = await bdd.IsBlocked(req.session.login, field['profil']);
		if (field['do_i_like'] && field['doesItLikeMe']){
			field['match'] = true;
		}
		else {
			field['match'] = false;
		}
		var find = users.find(element => element.login == req.params.login);

		//if (find != undefined){
		//user.last_visit = 'online';
		//}
		var result = await bdd_re.get_user_profile(field['profil']);
		var user = result[0];
		if (user.birthday){
			var date = new Date();
			var date1 = new Date(user.birthday);
			user.age = Math.floor((date.getTime() - date1.getTime()) / (1000*60*60*24*365));
		}
		field['pop'] = await bdd.addLikeVue(user.id, field['count_like'], field['nbVue']);
		result = await bdd_notif.save_notif(req.session.login, req.params.login, req.session.login + " is looking at your profile page");
		res.locals.title = "Profile";
		res.locals.field = field;
		res.locals.user = user;
		res.render('main_view/profile.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;


//res.locals.login_profil = req.params.login;
//res.locals.session = req.session;
//res.locals.title = "Profile";
//nbVue = await bdd.countVue(req.params.login);
//result = await bdd_re.get_user_profile(req.params.login);
//user = result[0];
//id = user.id;
//result = await bdd.doILike(req.session.login, user.login);
//user.do_i_like = result;
//result = await bdd.doesItLikeMe(req.session.login, user.login);
//user.does_it_like_me = result;
//count_like = await bdd.countLike(req.params.login);
////ajouter add_visited_on_profile
//done = await bdd.add_visited_profile(req.session.login, req.params.login);
//if (user.do_i_like && user.does_it_like_me){
//	user.match = true;
//}
//else {
//	user.match = false;
//}
//if (user.birthday){
//	var date = new Date();
//	var date1 = new Date(user.birthday);
//	user.age = Math.floor((date.getTime() - date1.getTime()) / (1000*60*60*24*365));
//}
//result = await bdd.IsReport(req.session.login, req.params.login);
//block = await bdd.IsBlocked(req.session.login, req.params.login);
//user.block = block;
//pop = await bdd.addLikeVue(id, count_like, nbVue);
//result = await bdd_notif.save_notif(req.session.login, req.params.login, req.session.login + " is looking at your profile page");
//req.session.pop = pop;
//find = users.find(element => element.login == req.params.login);
//if (find != undefined){
//	user.last_visit = 'online';
//}
//res.render('main_view/profile.ejs', {session: req.session, user: user, report: result});
