let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_signInGet = function sign_in(req, res){
    res.locals.title = "Sign In";
	res.render('sign-in.ejs', { session: req.session});
}

module.exports.ctrl_signInPost = function signInPost(req, res){
	console.log("la console" + req.body.login);
	var login = req.body.login;
	req.session.login = login;
	bdd.check_log(login, (result, result1) => {
		req.session.logexist = undefined;
		if (result == 0 && result1 == 0){
			req.session.logexist = 2;
			req.session.login = undefined;
			res.redirect('/sign-in');
		}
		else if (result1 > 0){
			req.session.logexist = 3;
			req.session.login = undefined;
			res.redirect('/sign-in');
		}
		else if (result > 0){
			bdd.isLoginPasswdMatch(login, req.body.passwd, function(match){
				if (match) {
					console.log("Password Match");
					login = req.body.login;
					req.session.logon = true;
					req.session.login = login;
				}
				else {
					console.log("Password dont Match");
					req.session.logon = false;
				}
				res.redirect('/sign-in');
			});
		}
	})
}

