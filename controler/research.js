let bdd = require('../models/research.js');


module.exports.ctrl_researchGet = function profileLoginGet(req, res){

	uneVariable = 3;
	bdd.get_user(uneVariable, (all_user) => {
		res.locals.users = all_user;
	});
    res.render('research.ejs', {session: req.session});
}

module.exports.ctrl_researchPost = function profileLoginPost(req, res){
}
