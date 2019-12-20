let bdd = require('../models/account.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/').get((req, res) => {
	res.locals.title = "Sign In";
	res.render('main_view/sign-in.ejs', { locals: res.locals, session: req.session});
});


router.route('/').post( async (req, res) => {
try {
	var login = req.body.login;
	var passwd = req.body.passwd;

	check_login = await bdd.checkLoginSignIn(login);

	if (check_login != "ok"){
		req.session.ans['check_login'] = check_login;
		res.redirect('/sign-in');
	}
	else{
		req.session.ans['login'] = login;
		passwd_match = await bdd.isLoginPasswdMatch(login, passwd);
		console.log(passwd_match);;
		if (passwd_match != "match"){
			req.session.ans['check_passwd'] = passwd_match;
			res.redirect('/sign-in');
		}
		else{
			req.session.first_log = true;
			req.session.logon = true;
			req.session.login = login;
			bdd.save_connection_log(login);
			bdd.notification(login, (user_id) =>{
				const user = { id: user_id, username: login};
				let jwtToken = jwt.sign(user, 'secretkey');
				req.session.token = jwtToken;
				req.session.ans['notification_general'] = "Successfully login"
				res.redirect('/about-you');
			});
		}
	}
}
catch{
	console.log("une erreur BBBBBBBBBBBB");
}
});


// router.route('/').post((req, res) => {
// 	var login = req.body.login;
// 	var passwd = req.body.passwd;

// 	bdd.checkLoginSignIn(login, (check_login) => {
// 		if (check_login != "ok"){
// 			req.session.ans['check_login'] = check_login;
// 			res.redirect('/sign-in');
// 		}
// 		else{
// 			req.session.ans['login'] = login;
// 			bdd.isLoginPasswdMatch(login, passwd, function(passwd_match){
// 				if (passwd_match != "match"){
// 					req.session.ans['check_passwd'] = passwd_match;
// 					res.redirect('/sign-in');
// 				}
// 				else{
// 					req.session.first_log = true;
// 					req.session.logon = true;
// 					req.session.login = login;
// 					bdd.save_connection_log(login);
// 					bdd.notification(login, (user_id) =>{
// 						const user = { id: user_id, username: login};
// 						let jwtToken = jwt.sign(user, 'secretkey');
// 						req.session.token = jwtToken;
// 						req.session.ans['notification_general'] = "Successfully login"
// 						res.redirect('/about-you');
// 					});
// 				}
// 			});
// 		}
// 	})
// });

module.exports = router;
