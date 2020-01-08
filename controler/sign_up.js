"use strict";
let bdd = require('../models/account.js');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 2;

router.route('/').get((req, res) => {
	try {
		res.locals.title = "Sign Up";
		res.render('main_view/sign-up.ejs');
	}
	catch (err){
		console.log(err);
		res.redirect('back');
	}
});

router.route('/').post(async (req, res) => {
	try {
		var field = {};
		var check_field = {};
		field['lname']  = req.body.lname;
		field['fname']  = req.body.fname;
		field['mail']  = req.body.mail;
		field['login']  = req.body.login;
		field['passwd'] = req.body.passwd;
		field['verif']  = req.body.verif;
		check_field = await bdd.check_field_sign_up(field);
		var check = "ok";
		for (const property in check_field){
			if(check_field[property] != "ok"){
				check = "error";
			}
		}
		if (check == "error"){
			req.session.check_field = check_field;
			req.session.field = field;
			res.redirect('/sign-up');
		}
		else{
			var salt = await bcrypt.genSalt(saltRounds);
			var hash = await bcrypt.hash(field['passwd'], salt);
			bdd.insert_user(field, hash);
			req.session.ans['notification_general'] = "Please confirm your account on your email"
			res.redirect('/sign-in');
		}
	}
	catch (err){
		console.log(err);
		res.redirect('back');
	}
});

module.exports = router;
