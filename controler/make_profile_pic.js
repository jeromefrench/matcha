let bdd_about = require('../models/about_you.js');
let bdd = require('../models/bdd_functions.js');
const router = require('express').Router();

router.route('/:login/:num/profile').get((req, res) => {
	my_login = req.params.login;
	num = req.params.num;

	console.log("lAAAAAAAAAAAAAAAAAAAa");

	bdd.get_id_user(req.session.login, (id_user) => {
	//on met toute les photos du user a 0
		console.log("salut");
		console.log(id_user);
		bdd_about.profileToZero(id_user, () => {
			//puis on met la photo selectionner a 1
			path = "/public/photo/"+my_login+"/"+num;
			console.log("path to profile");
			console.log(path);
			bdd_about.profileToOne(path, () => {
				console.log("la photo sera mis en profile");
				res.redirect('back');
			});
		})
	});

	// console.log(my_login);
	// console.log(num);
	// path = "/public/photo/"+my_login+"/"+num;
	// console.log(path);
	// bdd_about.delPic(path);
});

module.exports = router;