let bdd = require('../models/about_you.js');
const router = require('express').Router();

router.route('/:login/:num/profile').get(async (req, res) => {
	//puis on met la photo selectionner a 1
	//on met toute les photos du user a 0
	my_login = req.params.login;
	num = req.params.num;
	id_user = await bdd.get_id_user(req.session.login);
	done = await bdd.profileToZero(id_user);
	path = "/public/photo/"+my_login+"/"+num;
	done = await bdd.profileToOne(path);
	res.redirect('/about-you');
});

router.route('/:login/:num').get(async (req, res) => {
	my_login = req.params.login;
	num = req.params.num;
	path = "/public/photo/"+my_login+"/"+num;
	resulst = await bdd.isProfile(path);
	if (result[0].profile == 1){
		//profile pic on delete pas
		res.redirect('back');
	}else {
		done = await bdd.delPic(path);
		res.redirect('/about-you');
	}
});

module.exports = router;
