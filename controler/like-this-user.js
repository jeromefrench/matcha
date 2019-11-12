let bdd = require('../models/like.js');


module.exports.ctrl_like_this_userGet = function sign_in(req, res){
	//le renvoyer d'ou il vient
	//	res.redirect('/sign-in');

	console.log("mon login" + req.session.login);
	console.log("le login i like" + req.params.login);

	my_login = req.session.login;
	the_login_i_like = req.params.login;
	bdd.addLike(my_login, the_login_i_like);


	// res.send('Votre like sera traiter GET');
	res.redirect('back');

    // res.locals.title = "Sign In";
    // res.render('sign-in.ejs', { session: req.session});
}

module.exports.ctrl_like_this_userPost = function signInPost(req, res){


	// console.log("la console" + req.body.login);
	// login = req.body.login;
    // bdd.isLoginPasswdMatch(login, req.body.passwd, function(match){
    	// if (match) {
			// console.log("Password Match");
			// login = req.body.login;
			// req.session.logon = true;
			// req.session.login = login;
			// res.redirect('/sign-in');
    	// }
        // else {
            // console.log("Password dont Match");
			// req.session.logon = false;
			// res.redirect('/sign-in');
        // }
    // });
}
