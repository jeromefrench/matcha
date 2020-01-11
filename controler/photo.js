let bdd = require('../models/about_you.js');
const router = require('express').Router();

router.route('/:login/:num/profile').get(async (req, res) => {
	try {
		var num = req.params.num;
		var id_user = await bdd.get_id_user(req.session.login);
		var path = "/public/photo/"+req.session.login+"/"+num;
		var test = await bdd.isPhotoExist(path);
		if (test == false){
			throw "la photo n'existe pas";
		}
		var done = await bdd.profileToZero(id_user);
		done = await bdd.profileToOne(path);
		res.redirect('/about-you');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/:login/:num').get(async (req, res) => {
	try {
		var my_login = req.session.login;
		var num = req.params.num;
		var path = "/public/photo/"+my_login+"/"+num;
		var test = await bdd.isPhotoExist(path);
		if (test == false){
			throw "la photo n'existe pas";
		}
		var result = await bdd.isProfile(path);
		if (result[0].profile == 1){
			req.session.ans['notification_general'] = "This is your profil picture, you can't delete it.";
			res.redirect('back');
		}else {
			var done = await bdd.delPic(path);
			res.redirect('/about-you');
		}
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
