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
		var find = users.find(element => element.login == req.params.login);

		if (find != undefined){
		user.last_visit = 'online';
		}
		res.render('main_view/profile.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;


