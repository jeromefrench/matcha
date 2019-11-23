const router = require('express').Router();
let bdd = require('../models/dashboard.js');

router.route('/').get((req, res) => {
	bdd.get_user_i_like(req.session.login, (all_user) => {
		console.log(all_user);
		if (all_user[0] != undefined){
			res.locals.users = all_user;
			console.log("hello");
		}else {
			res.locals.users = [];
			res.locals.users[0] = undefined; 
		}
		res.locals.page = "my-like";
 		res.render('dashboard', {session:req.session});
	});
});

router.route('/:my-like').get((req, res) => {
	bdd.get_user_i_like(req.session.login, (all_user) => {
		console.log(all_user);
		if (all_user[0] != undefined){
			res.locals.users = all_user;
			console.log("hello");
		}else {
			res.locals.users = [];
			res.locals.users[0] = undefined; 
		}
		res.locals.page = "my-like";
 		res.render('dashboard', {session:req.session});
	});
});

router.route('/:they-like-me').get((req, res) => {
	bdd.get_user_they_like_me(req.session.login, (all_user) => {
		console.log(all_user);
		if (all_user[0] != undefined){
			res.locals.users = all_user;
			console.log("hello");
		}else{
			res.locals.users = [];
			res.locals.users[0] = undefined; 
		}
		res.locals.page = "they-like-me";
    	res.render('dashboard', {session:req.session});
	});
});


router.route('/:they-watched-me').get((req, res) => {
	res.locals.page = "they-watched-me";
    res.render('dashboard', {session:req.session});
});


router.route('/:my-match').get((req, res) => {
	bdd.get_user_my_match(req.session.login, (all_user) => {
		console.log(all_user);
		if (all_user[0] != undefined){
			res.locals.users = all_user;
			console.log("hello");
		}else{
			res.locals.users = [];
			res.locals.users[0] = undefined; 
		}
		res.locals.page = "my-match";
    	res.render('dashboard', {session:req.session});
	});
});



module.exports = router;
