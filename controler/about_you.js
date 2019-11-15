let bdd_about = require('../models/about_you.js');
let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_aboutYouGet = function aboutYouGet(req, res){
	res.locals.title = "About You";

	bdd_about.get_info_user(req.session.login, (result) => {
		if (result != undefined) {
		   res.locals.infos = result[0];
		}
		if (res.locals.infos.interests != null){
			res.locals.infos.interArray = res.locals.infos.interests.split(",");
		}
		res.render('about-you.ejs', {session: req.session});
	})
}

function addPicture(id_user, req, rootPath){
	//on regarde combien de photo il a

	//si inferieur a 5 on add la photo
	number = 0;
	console.log("on try la photo");
	console.log(req.files);
	if (req.files != undefined && req.files.photo && req.files.photo.size != 0){
		if (req.files.photo.mimetype != "image/jpeg"){
			//utiliser mon middle ware flash
			console.log("le format est pas bon")
		}
		else{
			console.log("on add la photo");
			console.log(req.files.photo);
			console.log(req.files.photo.mimetype);
			number++;
			name = rootPath+"/public/photo/"+req.session.login+"/"+number;
			console.log("le name");
			console.log(name);
			req.files.photo.mv(name);
			console.log(req.files.photo);
			//on add le nom de la photo dans la base
		}
	}
}




module.exports.ctrl_aboutYouPost = function aboutYouPost(req, res, rootPath){
	gender = req.body.gender;
	orientation = req.body.orientation;
	bio = req.body.bio;
	interests = req.body.interests;
	bdd.get_id_user(req.session.login,  (id_user) => {
		id_user = id_user;
		bdd_about.is_info_user_exist(req.session.login, (userExist) => {
			if (userExist){
				bdd_about.update_info_user(id_user, gender, orientation, bio, interests);
				addPicture(id_user, req, rootPath);
			} else {
				bdd_about.insert_info_user(id_user, gender, orientation, bio, interests)
			}
		})
	});
	// res.redirect('/about-you');
}
