var bdd = require('../models/account.js');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const saltRounds = 2;

router.route('/:login/:num').get(async (req, res) => {
	try{
		var check = {};
		res.locals.log = req.params.login;
		res.locals.num = req.params.num;
		res.locals.title = "Change Password";
		check['passwd'] = await bdd.IsLoginNumMatch(req.params.login, req.params.num, "user");
		if (check['passwd'] == false){
			res.locals.ans['notification_general'] = "Wrong url.";
		}
		res.render('main_view/change-passwd.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/:login/:num').post(async (req, res) => {
	try{
		var field = {};
		var check_field = {};
		field['login'] = req.params.login;
		field['num'] = req.params.num;
		field['npass'] = req.body.npass;
		field['verif'] = req.body.verif;
		check_field['passwd'] = await bdd.IsLoginNumMatch(field['login'], field['num'], "user");
		if (check_field['passwd'] == false){
			req.session.ans['notification_general'] = "Wrong url.";
			req.session.check_field = check_field;
			req.session.field = field;
			res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
		}
		else{
			check_field['passwd'] = bdd.IsFieldOk(field['npass'], field['verif']);
			if (check_field['passwd'] != "ok"){
				req.session.check_field = check_field;
				req.session.field = field;
				res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
			}
			else{
				var salt = await bcrypt.genSalt(saltRounds);
				var hash = await bcrypt.hash(field['npass'], salt);
				var result = await bdd.changePass(field['login'], hash);
				req.session.ans['notification_general'] = "Your password has been changed, you can sign in";
				res.redirect('/sign-in');
			}
		}
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
