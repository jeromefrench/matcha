let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_signInGet = function sign_in(req, res){
    res.locals.title = "Sign In";
    res.render('sign-in.ejs', { session: req.session});
}

module.exports.ctrl_signInPost = function signInPost(req, res){
	console.log("la console" + req.body.login);
	login = req.body.login;
    bdd.isLoginPasswdMatch(login, req.body.passwd, function(match){
    	if (match) {
			console.log("Password Match");
			login = req.body.login;
			req.session.logon = true;
			req.session.login = login;
			res.redirect('/sign-in');
    	}
        else {
            console.log("Password dont Match");
			req.session.logon = false;
			res.redirect('/sign-in');
        }
    });
}

