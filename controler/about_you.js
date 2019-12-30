let bdd = require('../models/about_you.js');
const router = require('express').Router();
const opencage = require('opencage-api-client');

router.route('/').get(async (req, res) => {
	res.locals.title = "About You";
	res.locals.ans['user'] = await get_info_user(res, req.session.login);
	res.render('main_view/about-you.ejs');
});

router.route('/').post(async (req, res) => {
try {
	var field = {};
	var check_field = {};
	var done;

	field['gender'] = req.body.gender;
	field['orientation'] = req.body.orientation;
	field['birthday'] = req.body.birthday;
	field['bio'] = req.body.bio;
	field['interests'] = req.body.interests;
	field['country'] = req.body.country;
	field['city'] = req.body.city;
	field['zip_code'] = req.body.zipcode;

	check_field['gender'] = check_gender(field['gender']);
	check_field['orientation'] = check_orientaiton(field['orientation']);
	check_field['birthday'] = check_birthday(field['birthday']);
	check_field['bio'] = check_bio(field['bio']);
	check_field['interests'] = check_interests(field['interests']);
	if (req.body.submit_button == "Localise Me") {
		req.session.ans['localise_me'] = true;
	}
	else{
		check_field['country'] = help_noempty(field['country']);
		check_field['city'] = help_noempty(field['city']);
		check_field['zip_code'] = help_noempty(field['zip_code']);
		check_field['localisation'] = check_localisation(check_field);
	}
	if (check_field['localisation'] == "ok"){
		field = await searchAdresse(field);
	}
	if (field['localisation'] == "ok"){
		check_field['longitude'] = "ok";
		check_field['latitude'] = "ok";
	}
	else{
		check_field['localisation'] == "error"
	}
	for (const property in check_field){
		if(check_field[property] == "ok" && property != localisation){
			done = await bdd.InfoUser(req.session.login, property, field[property]);
		}
	}
	var number = await bdd.count_photo(id_user);
	check_field['picture'] = check_picture(req.files, req.session.login, number);
	if (check_field['picture'] == "ok"){
		done = await savePic(req.files, req.session.login, number);
	}
	req.sessions.check_field = check_field;
	req.sessions.field = field;
	res.redirect('/about-you');
}
catch (err){
	console.log(err);
}
});



function check_localisation(check_field){
	if (check_field['country'] == "ok" &&
		check_field['city'] == "ok" &&
		check_field['zip_code'] == "ok"){
	}
	return "ok";
}


//*****************************************************************
//FUNCTION
//*****************************************************************

function check_gender(gender){
	check_field = help_noempty(gender);
	if (check_field == "ok" && gender != "male" && gender != "female" && gender != "other"){
		check_field = "wrong";
	}
	return check_field;
}

function check_orientation(orientation){
	check_field = help_noempty(orientation);
	if (check_field == "ok" && orientation != "everyone" && orientation != "women" && orientation != "men"){
		check_field = "wrong";
	}
	return check_field;
}

function check_birthday(birthday){
	check_field = help_noempty(birthday);
	birthday = birthday.split("/");
	birthday = birthday[2]+ "-"+ birthday[0]+"-"+birthday[1];
	//faire une regex pour tester le format
	return check_field;
}

function check_bio(bio){
	//check_field['bio'] = help_noempty(field['bio']); marche pas car espace
	if (bio != undefined && bio != ""){
		check_field = "ok";
	}
	else{
		check_field = "empty";
	}
	return check_field;
}

function check_interests(interests){
	check_field = help_noempty(interests);
	if (check_field == "ok" &&
		interests != "voyage" &&
		interests != "cuisine" &&
		interests != "escalade" &&
		interests != "equitation" &&
		interests != "soleil" &&
		interests != "sieste"){
		check_field = "wrong";
	}
	return check_field;
}







async function savePic(files, login, number){
	number++;
	var profile = 0;
	if (number == 0){
		profile = 1;
	}
	name = rootPath+"/public/photo/"+login+"/"+number;
	files.photo.mv(name);
	done = await bdd.savePic(id_user, "/public/photo/"+login+"/"+number, profile)
	return done;
}

function check_picture(files, login, number){
	if (files == undefined || files.photo == undefined || files.photo.size == 0){
		check_pic = "no_pic_uploaded";
	}
	else if (files.photo.mimetype != "image/jpeg"){
		check_pic = "wrong_format";
	}
	else if (number > 5){
		check_pic = "photo_exed_5";
	}
}

async function get_info_user(res, login){
	user = await bdd.get_info_user(login);
	user = user[0];
	for (const property in user){
		if(user[property] != null){
			user[property] = user[property];
		}
		else{
			user[property] = false;
		}
	}
	if (user != undefined && user.birth != undefined && user.birth != false)
	{
		console.log("le user birth");
		console.log(user.birth);
		user.birthday = user.birth;
		user.birthday = user.birthday.replace("\\", "/");
		user.birthday = user.birthday.replace("\\", "/");
		user.birthday = user.birthday.replace("\\", "/");
		user.birthday = user.birthday.split("/");
		user.birthday = user.birthday[1]+ "/"+ user.birthday[2]+"/"+user.birthday[0];
	}
	if (user != undefined && user.interests != false){
		user.interests = user.interests.split(",");
	}
	pic = await bdd.getPic(id_user);
	if (pic != false){
		user.pic = pic;
	}
	return user;
}

async function searchAdresse(field){
	loc = field['country'] + "  " + field['city'] + "  " + field['zip_code'];
	data = await opencage.geocode({q: '' + loc});
	if (data.status.code == 200 && data.results.length > 0) {
		var place = data.results[0];
		field['country'] = place.components.country;
		field['city' ] = place.components.city;
		field['zip_code'] = place.components.postcode;
		field['latitude'] = place.geometry.lat;
		field['longitude'] = place.geometry.lng;
		check_field['localisation'] = "ok";
	}
	else {
		check_field['localisation'] = "error";
	}
	return check_field;
}

function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return "empty";
	return "ok";
}

module.exports = router;
