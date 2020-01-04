let bdd = require('../models/account.js');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const saltRounds = 2;

router.route('/').get(async (req, res) => {
	if (res.locals.check_field == undefined){
		res.locals.check_field = false;
	}
	res.locals.title = "My Account";
	res.locals.user = await bdd.recover_user_(req.session.login);
	res.render('main_view/my-account.ejs');
});

router.route('/').post(async (req, res) => {
try{
	var field = {};
	var check_field = {};
	field['lname']  = req.body.lname;
	field['fname']  = req.body.fname;
	field['mail']  = req.body.mail;
	field['login']  = req.body.login;
	field['npasswd'] = req.body.npass;
	field['verif']  = req.body.verif;
	check_field = await bdd.check_field_my_account(req.session.login, field);
	var check = "ok";
	for (const property in check_field){
		if(check_field[property] != "ok" && check_field[property] != "change_passwd"){
			check = "error";
		}
	}
	if (check == "error"){
		req.session.check_field = check_field;
		req.session.field = field;
		res.redirect('/my-account');
	}
	else if (check_field['passwd'] == "ok"){
		var done = await bdd.update_user(field['lname'], field['fname'], field['mail'], field['login'], req.session.login);
		req.session.login = field['login'];
		req.session.ans['notification_general'] = "Account information succesfully update";
		res.redirect('/my-account');
	}
	else if (check_field['passwd'] == "change_passwd"){
		var salt = await bcrypt.genSalt(saltRounds);
		var hash = await bcrypt.hash(field['npasswd'], salt);
		bdd.update_user_and_passwd(field, hash, req.session.login);
		req.session.login = field['login'];
		req.session.ans['notification_general'] = "Account information succesfully update";
		res.redirect('/my-account');
	}
}
catch (err){
	console.log(err);
}
});

module.exports = router;
