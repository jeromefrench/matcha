
let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_aboutYou = function aboutYouGet(req, res){
	res.locals.title = "About You";
	res.render('about-you.ejs');
}


module.exports.ctrl_aboutYou = function aboutYouPost(req, res){
	gender = req.body.gender;
	orientation = req.body.orientation;
	bio = req.body.bio;
	bdd.get_id_user(log, (id_user) => {
		var id = id_user;
		bdd.insert_info(id, gender, orientation, bio);
	});
}
