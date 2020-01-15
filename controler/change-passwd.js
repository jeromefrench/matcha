var bdd = require('../models/account.js');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const saltRounds = 2;

router.route('/:token').get(async (req, res) => {
	try{
		var check = {};
		res.locals.title = "Change Password";
		var token = req.params.token;
		if (token != ""){
			res.locals.cp_token = token;
			var decoded = jwt.verify(token, 'secretkey', {algorithms: ['HS256']});
			check['passwd'] = await bdd.IsLoginNumMatch(decoded.login, decoded.num, "user");
			if (check['passwd'] == false){
				res.locals.ans['notification_general'] = "Wrong url.";
			}
		}
		else{
			res.locals.ans['notification_general'] = "Wrong url.";
		}
		// res.locals.token = token;
		// var decoded = jwt.verify(token, 'secretkey', {algorithms: ['HS256']});
		// check['passwd'] = await bdd.IsLoginNumMatch(req.params.login, req.params.num, "user");
		// if (check['passwd'] == false){
		// 	res.locals.ans['notification_general'] = "Wrong url.";
		// }
		res.render('main_view/change-passwd.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/:token').post(async (req, res) => {
	try{
		var field = {};
		var check_field = {};
		var token = req.params.token;
		if (token == ""){
			res.redirect('/change-passwd');
		}
		var decoded = jwt.verify(token, 'secretkey', {algorithms: ['HS256']});
		field['login'] = decoded.login;
		field['num'] = decoded.num;
		field['npass'] = req.body.npass;
		field['verif'] = req.body.verif;
		check_field['passwd'] = await bdd.IsLoginNumMatch(field['login'], field['num'], "user");
		if (check_field['passwd'] == false){
			req.session.ans['notification_general'] = "Wrong url.";
			req.session.check_field = check_field;
			req.session.field = field;
			res.redirect('/change-passwd/'+ token);
		}
		else{
			check_field['passwd'] = bdd.IsFieldOk(field['npass'], field['verif']);
			if (check_field['passwd'] != "ok"){
				req.session.check_field = check_field;
				req.session.field = field;
				res.redirect('/change-passwd/'+ token);
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
