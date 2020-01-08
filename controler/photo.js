"use strict";
let bdd = require('../models/about_you.js');
const router = require('express').Router();

router.route('/:login/:num/profile').get(async (req, res) => {
	try {
		var num = req.params.num;

		//a faire verifier que la photo existe

		var id_user = await bdd.get_id_user(req.session.login);
		var done = await bdd.profileToZero(id_user);
		var path = "/public/photo/"+req.session.login+"/"+num;
		done = await bdd.profileToOne(path);
		res.redirect('/about-you');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/:login/:num').get(async (req, res) => {
	try {
		var my_login = req.session.login;
		var num = req.params.num;
		var path = "/public/photo/"+my_login+"/"+num;
		var result = await bdd.isProfile(path);
		if (result[0].profile == 1){
			//profile pic on delete pas
			res.redirect('back');
		}else {
			var done = await bdd.delPic(path);
			res.redirect('/about-you');
		}
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
