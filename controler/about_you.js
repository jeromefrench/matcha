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
		bdd.get_id_user(req.session.login,  (id_user) => {
			bdd_about.getPic(id_user, (result) => {
				console.log(result);
				if (result != false){
					// res.locals.pic = Array.from(result, ({path_photo}) => path_photo);
					res.locals.pic = result;
				}
				console.log(res.locals.pic);
				res.render('about-you.ejs', {session: req.session});
			})
		});
	})
}

function addPicture(id_user, req, rootPath){
	//on regarde combien de photo il a

	//si inferieur a 5 on add la photo
	console.log("on try la photo");
	console.log(req.files);
	if (req.files != undefined && req.files.photo && req.files.photo.size != 0){
		if (req.files.photo.mimetype != "image/jpeg"){
			//utiliser mon middle ware flash
			console.log("le format est pas bon")
		}
		else{
			bdd_about.count_photo(id_user, (number) => {
				console.log("number");
				console.log(number);
				if (number < 5){
					console.log("on add la photo");
					console.log(req.files.photo);
					console.log(req.files.photo.mimetype);
					name = rootPath+"/public/photo/"+req.session.login+"/"+number;
					console.log("le name");
					console.log(name);
					req.files.photo.mv(name);
					console.log(req.files.photo);
					//on add le nom de la photo dans la base
					profile = 0;
					if (number == 0){
						profile = 1;
						console.log("ici");
					}
					bdd_about.savePic(id_user, "/public/photo/"+req.session.login+"/"+number, profile)
					number++;
				}
				else {
					console.log("le nombre de photo est superieur a 5");
				}
			});
		}
	}
	else
	{
		console.log("size 0");
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
				addPicture(id_user, req, rootPath);
			}
		})
	});
	res.redirect('/about-you');
}

