let bdd = require('../models/about_you.js');
const router = require('express').Router();
const opencage = require('opencage-api-client');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


router.route('/').get(async (req, res) => {
	res.locals.title = "About You";
	res.locals.ans['user'] = await get_info_user(res, req.session.login);
	console.log("suer GEEET");
	console.log(res.locals.ans['user']);
	res.render('about-you.ejs');
});

router.route('/').post(async (req, res) => {
	field = {};
	check_field = {};
	field['gender'] = req.body.gender;
	field['orientation'] = req.body.orientation;
	field['birthday'] = req.body.birthday;
	field['bio'] = req.body.bio;
	field['interests'] = req.body.interests;
	field['country'] = req.body.country;
	field['city'] = req.body.city;
	field['zip_code'] = req.body.zipcode;

	//console.log("req body");
	//console.log(req.body);

	////*****************************************************************gender
	check_field['gender'] = help_noempty(field['gender']);
	if (check_field == "ok" && field['gender'] != "male" && field['gender'] != "female" && field['gender'] != "other"){
		check_field['gender'] = "wrong";
	}
	////*****************************************************************orientation
	check_field['orientation'] = help_noempty(field['orientation']);
	if (check_field == "ok" && field['orientation'] != "everyone" && field['orientation'] != "women" && field['orientation'] != "men"){
		check_field['orientation'] = "wrong";
	}
	////*****************************************************************birthday
	check_field['birthday'] = help_noempty(field['birthday']);
	field['birthday'] = field['birthday'].split("/");
	field['birthday'] = field['birthday'][2]+ "-"+ field['birthday'][0]+"-"+field['birthday'][1];
	//faire une regex pour tester le format

	////*****************************************************************bio
	//check_field['bio'] = help_noempty(field['bio']); marche pas car espace
	if (field['bio'] != undefined && field['bio'] != ""){
		check_field['bio'] = "ok";
	}


	////*****************************************************************interests
	check_field['interests'] = help_noempty(field['interests']);
	if (check_field == "ok" &&
		field['interests'] != "voyage" &&
		field['interests'] != "cuisine" &&
		field['interests'] != "escalade" &&
		field['interests'] != "equitation" &&
		field['interests'] != "soleil" &&
		field['interests'] != "sieste"){
		check_field['interests'] = "wrong";
	}
	//*****************************************************************
	//Localisation
	//*****************************************************************
	if (req.body.submit_button == "Localise Me") {
		req.session.ans['localise_me'] = true;
	}
	else{
		check_field['country'] = help_noempty(field['country']);
		check_field['city'] = help_noempty(field['city']);
		check_field['zip_code'] = help_noempty(field['zip_code']);
		if (check_field['country'] == "ok" && check_field['city'] == "ok" && check_field['zip_code'] == "ok"){
			field = await searchAdresse(field);
			if (field['localisation'] == "error"){
				check_field['country'] = "wrong";
				check_field['city'] = "wrong";
				check_field['zip_code'] = "wrong";
				check_field['latitude'] = "wrong";
				check_field['longitude'] = "wrong";
			}
			else
			{
				check_field['country'] = "ok";
				check_field['city'] = "ok";
				check_field['zip_code'] = "ok";
				check_field['latitude'] = "ok";
				check_field['longitude'] = "ok";
			}
		}
	}
	for (const property in check_field){
		if(check_field[property] == "ok"){
			done = await bdd.InfoUser(req.session.login, property, field[property]);
		}
	}

	//*****************************************************************
	//PICTURE
	//*****************************************************************
	number = await bdd.count_photo(id_user);
	if (req.files == undefined || req.files.photo == undefined || req.files.photo.size == 0){
		check_field['pic'] = "no_pic_uploaded";
		console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
		console.log("no pic uploaded");
	}
	else if (req.files.photo.mimetype != "image/jpeg"){
		check_field['pic'] = "wrong_format";
		console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
		console.log("wrong format");
	}
	else if (number > 5){
		check_field['pic'] = "photo_exed_5";
		console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
		console.log("plus than 5 ");
	}
	else{
		console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
		console.log("all good");
		name = rootPath+"/public/photo/"+req.session.login+"/"+number;
		req.files.photo.mv(name);
		profile = 0;
		if (number == 0){
			profile = 1;
		}
		done = await bdd.savePic(id_user, "/public/photo/"+req.session.login+"/"+number, profile)
		number++;
	}

	req.session.ans = {};
	req.session.ans['user'] = field;
	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	console.log(req.session.ans['user']);
	res.redirect('/about-you');
});


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
		field['localisation'] = "ok";
	}
	else {
		field['localisation'] = "error";
	}
	return field;
}

function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return "empty";
	return "ok";
}

module.exports = router;
