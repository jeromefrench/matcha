let bdd = require('./models/account.js');
let bdd_about = require('./models/about_you');
let bdd2 = require('./models/interractions.js');
const bcrypt = require('bcrypt');
const saltRounds = 2;

var cities = require("all-the-cities");
const router = require('express').Router();
faker = require('faker/locale/fr');
var Fakerator = require('fakerator');
var fakerator = Fakerator("fr-FR");

router.route('/').get((req, res) => {
	fakeUser();
	res.send("<p>Your on faker page</p>");
});

router.route('/:num').get((req, res) => {
	i = 0;
	while (i < req.params.num){
		fakeUser();
		i++;
	}
	res.send("<p>Your on faker page</p>");
});


async function fakeUser()
{
	var user = fakerator.entity.user();
	var login = user.userName;
	var mail = user.email;

	var passwd = user.password;
	var fname = user.lastName;
	var lname = user.firstName;

	var salt = await bcrypt.genSalt(saltRounds);
    var hash = await bcrypt.hash(passwd, salt);
	var done = bdd.valide_user_fake(login, hash, fname, lname, mail);
	var id_user = await bdd.get_id_user(login);
	image = faker.internet.avatar();
	path = image;

	profile = 1;

	gender = faker.random.arrayElement(["male","female","other"]);
	orientation = faker.random.arrayElement(["men","women","everyone"]);
	bio = faker.lorem.sentence();
	interests = [];
	number = faker.random.arrayElement(["1","2","3","4","5","6"]);
	i = 0;
	while (i < number){
		interests.push(faker.random.arrayElement(["voyage","cuisine","escalade","equitation","soleil","sieste"])) ;
		i++;
	}
	birthdate = faker.date.between('1920-01-01', '2001-01-01');
	city = user.address.city;

	info_city = [];
	while (info_city[0] == undefined){
		info_city = cities.filter(town => { return town.name.match('^' + city + '$')});
		if (info_city[0] == undefined){
			user = fakerator.entity.user();
			city = user.address.city;
		}
	}
	country = info_city[0].country;
	zipcode = info_city[0].muniSub;
	latitude = info_city[0].loc.coordinates[1];
	longitude = info_city[0].loc.coordinates[0];

	try{
		bdd_about.insert_info_user(login, "gender", gender);
		bdd_about.update_info_user(login, "orientation", orientation);
		bdd_about.update_info_user(login, "bio", bio);
		bdd_about.update_info_user(login, "interests", interests);
		bdd_about.update_info_user(login, "birthday", birthdate);
		bdd_about.update_info_user(login, "country", country);
		bdd_about.update_info_user(login, "city", city);
		bdd_about.update_info_user(login, "zip_code", zipcode);
		bdd_about.update_info_user(login, "longitude", longitude);
		bdd_about.update_info_user(login, "latitude", latitude);


		bdd2.insert_log(id_user);
		bdd2.add_fakeVueLike(id_user);
		bdd_about.savePic(id_user, path, profile);
		bdd_about.isCompleted(login);
	}
	catch(err){
		console.log("petit probleme ");
		console.log(err);
	}
}

module.exports = router;
