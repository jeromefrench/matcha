let bdd = require('../models/account.js');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 2;

router.route('/').get((req, res) => {
	res.locals.title = "Sign Up";
	res.render('main_view/sign-up.ejs', {session: req.session});
});

router.route('/').post(async (req, res) => {
	field = {};
	field['lname']  = req.body.lname;
	field['fname']  = req.body.fname;
	field['mail']  = req.body.mail;
	field['login']  = req.body.login;
	field['passwd'] = req.body.passwd;
	field['verif']  = req.body.verif;
	check_field = await bdd.check_field_sign_up(field);
	check = "ok";
	for (const property in check_field){
		if(check_field[property] != "ok"){
			check = "error";
		}
	}
	if (check == "error"){
		req.session.ans.check_field = check_field;
		req.session.ans.field = field;
		res.redirect('/sign-up');
	}
	else{
		salt = await bcrypt.genSalt(saltRounds);
		hash = await bcrypt.hash(field['passwd'], salt);
		bdd.insert_user(field, hash);
		req.session.ans['notification_general'] = "Please confirm your account on your email"
		res.redirect('/sign-up');
	}
});

module.exports = router;
