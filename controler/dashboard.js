const router = require('express').Router();
let bdd = require('../models/dashboard.js');


function bebe_char(res, all_user){
	if (all_user[0] != undefined){
		res.locals.users = all_user;
	}else {
		res.locals.users = [];
		res.locals.users[0] = undefined;
	}
}

router.route('/').get(async (req, res) => {
	var all_user = await bdd.get_user_i_like(req.session.login);
	bebe_char(res, all_user);
	res.locals.page = "my-like";
 	res.render('main_view/dashboard.ejs');
});

router.route('/:my-like').get(async (req, res) => {
	var all_user = await bdd.get_user_i_like(req.session.login);
	bebe_char(res, all_user);
	res.locals.page = "my-like";
 	res.render('main_view/dashboard.ejs');
});

router.route('/:they-like-me').get(async (req, res) => {
	var all_user = await bdd.get_user_they_like_me(req.session.login);
	bebe_char(res, all_user);
	res.locals.page = "they-like-me";
 	res.render('main_view/dashboard.ejs');
});


router.route('/:they-watched-me').get(async (req, res) => {
	var all_user = await bdd.get_user_they_watched_me(req.session.login);
	bebe_char(res, all_user);
	res.locals.page = "they-watched-me";
 	res.render('main_view/dashboard.ejs');
});


router.route('/:my-match').get(async (req, res) => {
	var all_user = await bdd.get_user_my_match(req.session.login);
	bebe_char(res, all_user);
	res.locals.page = "my-match";
 	res.render('main_view/dashboard.ejs');
});

module.exports = router;
