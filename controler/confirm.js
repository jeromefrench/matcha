let bdd = require('../models/account.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/:token').get(async (req, res) => {
	try{
		var token = req.params.token;
		if (token != ""){
			var decoded = jwt.verify(token, 'secretkey', {algorithms: ['HS256']});
			var login = decoded.login;
			var num = decoded.num;
			var suspense = await bdd.IsLoginNumMatch(login, num, "user_sub");
			if (suspense){
				var data = await bdd.recover_user_data(login);
				var done = bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail);
				req.session.ans['notification_general'] = "Your account is validated.";
			}
			else{
				req.session.ans['notification_general'] = "Wrong url.";
			}
		}
		else{
			req.session.ans['notification_general'] = "Wrong url.";
		}
		// var suspense = await bdd.IsLoginNumMatch(login, num, "user_sub");
		// if (suspense){
		// 	var data = await bdd.recover_user_data(num);
		// 	var done = bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail, num);
		// 	req.session.ans['notification_general'] = "Your account is validated.";
		// }
		// else{
		// 	req.session.ans['notification_general'] = "Wrong url."
		// }
		res.redirect('/sign-in');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
