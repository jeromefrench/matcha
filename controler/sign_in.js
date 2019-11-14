let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_signInGet = function sign_in(req, res){
    res.locals.title = "Sign In";
    res.render('sign-in.ejs', { session: req.session});
}

module.exports.ctrl_signInPost = function signInPost(req, res){
	console.log("la console" + req.body.login);
	var login = req.body.login;
	bdd.check_log(login, (result) => {
		if (!result){
			req.session.logexist = 2;
		}
		else{
			req.session.logexist = 3;
		}
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
	})
}

