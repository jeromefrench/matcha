let bdd_re = require('../models/research.js');
let bdd = require('../models/interractions.js');
var bdd_notif = require('../models/notifications.js');
const router = require('express').Router();

router.route('/:login').get(async (req, res) => {
	res.locals.login_profil = req.params.login;
	res.locals.session = req.session;
	res.locals.title = "Profile";
	nbVue = await bdd.countVue(req.params.login);
	result = await bdd_re.get_user_profile(req.params.login);
	user = result[0];
	id = user.id;
	result = await bdd.doILike(req.session.login, user.login);
	user.do_i_like = result;
	result = await bdd.doesItLikeMe(req.session.login, user.login);
	user.does_it_like_me = result;
	count_like = await bdd.countLike(req.params.login);
	//ajouter add_visited_on_profile
	done = await bdd.add_visited_profile(req.session.login, req.params.login);
	if (user.do_i_like && user.does_it_like_me){
		user.match = true;
	}
	else {
		user.match = false;
	}
	if (user.birthday){
		var date = new Date();
		var date1 = new Date(user.birthday);
		user.age = Math.floor((date.getTime() - date1.getTime()) / (1000*60*60*24*365));
	}
	result = await bdd.IsReport(req.session.login, req.params.login);
	block = await bdd.IsBlocked(req.session.login, req.params.login);
	user.block = block;
	pop = await bdd.addLikeVue(id, count_like, nbVue);
	result = await bdd_notif.save_notif(req.session.login, req.params.login, req.session.login + " is looking at your profile page");
	req.session.pop = pop;
	find = users.find(element => element.login == req.params.login);
	if (find != undefined){
		user.last_visit = 'online';
	}
	res.render('profile.ejs', {session: req.session, user: user, report: result});
});

module.exports = router;
