let bdd_about = require('../models/about_you.js');
let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_aboutYouGet = function aboutYouGet(req, res){
	res.locals.title = "About You";

	bdd_about.get_info_user(req.session.login, (result) => {
		if (result != undefined) {
		   res.locals.infos = result[0];
		}
		console.log("on log");
		console.log(res.locals.infos);
		if (res.locals.infos.interests != null){
			res.locals.infos.interArray = res.locals.infos.interests.split(",");
		}
		console.log(res.locals.infos.interArray);
		res.render('about-you.ejs', {session: req.session});
	})
}

module.exports.ctrl_aboutYouPost = function aboutYouPost(req, res){
	gender = req.body.gender;
	orientation = req.body.orientation;
	bio = req.body.bio;
	interests = req.body.interests;
	bdd.get_id_user(req.session.login,  (id_user) => {
		id_user = id_user;
		bdd_about.is_info_user_exist(req.session.login, (userExist) => {
			if (userExist){
				console.log("dans le controler");
				console.log(interests)
				bdd_about.update_info_user(id_user, gender, orientation, bio, interests);
			} else {
				bdd_about.insert_info_user(id_user, gender, orientation, bio, interests)
			}
		})
	});
	res.redirect('/about-you');
}
