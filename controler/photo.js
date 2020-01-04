let bdd = require('../models/about_you.js');
const router = require('express').Router();

router.route('/:login/:num/profile').get(async (req, res) => {
	//puis on met la photo selectionner a 1
	//on met toute les photos du user a 0


	//verifier si la photo exist
	var num = req.params.num;
	var id_user = await bdd.get_id_user(req.session.login);
	var done = await bdd.profileToZero(id_user);
	var path = "/public/photo/"+req.session.login+"/"+num;
	done = await bdd.profileToOne(path);
	res.redirect('/about-you');
});

router.route('/:login/:num').get(async (req, res) => {


	//verifier si la photo exist
	var my_login = req.session.login;
	var num = req.params.num;
	var path = "/public/photo/"+my_login+"/"+num;
	var result = await bdd.isProfile(path);
	if (result[0].profile == 1){
		//profile pic on delete pas
		res.redirect('back');
	}else {
		done = await bdd.delPic(path);
		res.redirect('/about-you');
	}
});

module.exports = router;
