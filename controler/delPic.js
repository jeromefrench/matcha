let bdd_about = require('../models/about_you.js');
const router = require('express').Router();

router.route('/:login/:num').get((req, res) => {
	my_login = req.params.login;
	num = req.params.num;
			console.log(my_login);
			console.log(num);
			path = "/public/photo/"+my_login+"/"+num;
			console.log(path);
		console.log("le path");
		console.log(path);
	//if photo profile interdire la suppression
	bdd_about.isProfile(path, (result) => {
		if (result[0].profile == 1){
			//profile pic on delete pas
			console.log("la photo sera PAS DEL CAR PROFILE del")
		console.log("result");
		console.log(result);
			res.redirect('back');
		}else {
			console.log("la photo sera del")
		console.log("result");
		console.log(result);
			bdd_about.delPic(path);
			res.redirect('back');
		}
	})
});

module.exports = router;