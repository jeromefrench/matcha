let bdd_about = require('../models/about_you.js');

module.exports.ctrl_delPicGet = function delPic(req, res){
	my_login = req.params.login;
	num = req.params.num;
	console.log("la photo sera del")
	console.log(my_login);
	console.log(num);
	path = "/public/photo/"+my_login+"/"+num;
	console.log(path);
	bdd_about.delPic(path);
	res.redirect('back');
}
