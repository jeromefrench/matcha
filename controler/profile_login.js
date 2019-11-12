let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_profileLoginGet = function profileLoginGet(req, res){
	res.locals.login_profil = req.params.login;
	res.locals.session = req.session;
    res.render('profile.ejs');
}


module.exports.ctrl_profileLoginPost = function profileLoginPost(req, res){
}
