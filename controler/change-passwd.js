var bdd = require('../models/account.js');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const saltRounds = 2;

router.route('/:login/:num').get((req, res) => {
	res.locals.title = "Change Password";
	res.render('main_view/change-passwd.ejs');
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
			req.session.ans['notification_general'] = "The login and num dont match";
			req.session.check_field = check_field;
			req.session.field = field;
			res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
		}
		else{
			check_field['passwd'] = bdd.IsFieldOk(field['npass'], field['verif']);
			if (check_fiel['passwd'] != "ok"){
				req.session.check_field = check_field;
				req.session.field = field;
				res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
			}
			else{
				var salt = await bcrypt.genSalt(saltRounds);
				var hash = await bcrypt.hash(field['npass'], salt);
				bdd.changePass(field['login'], hash);
				req.session.ans['notification_general'] = "Your password has been change you can sign in";
				res.redirect('/sign-in');
			}
		}
	}
	catch (err){
		console.log(err);
		res.redirect('/error');
	}
});

module.exports = router;
