let bdd = require('./models/confirm');
let bdd_pic = require('./models/about_you');
let bdd2 = require('./models/bdd_functions.js');
const bcrypt = require('bcrypt');
const saltRounds = 2;

// var faker = require('faker');
var cities = require("all-the-cities");
const router = require('express').Router();
var faker = require('faker/locale/fr');
var Fakerator = require('fakerator');
var fakerator = Fakerator("fr-FR");

router.route('/').get((req, res) => {
	fakeUser();
	res.send("<p>Your on faker page</p>");
});



function fakeUser()
{
	var user = fakerator.entity.user();
	var login = user.userName;
	var mail = user.email;

	var passwd = user.password;
	var fname = user.firstName;
	var lname = user.lastName;

	bcrypt.genSalt(saltRounds, function(err, salt) {
    	bcrypt.hash(passwd, salt, function(err, hash) {
			bdd.valide_user_fake(login, hash, fname, lname, mail, ()=> {
				bdd2.get_id_user(login, (id_user) => {
					image = faker.internet.avatar();
					path = image;
					profile = 1;

					gender = faker.random.arrayElement(["male","female","other"]);
					orientation = faker.random.arrayElement(["men","women","everyone"]);
					bio = faker.lorem.sentence();
					interests = faker.random.arrayElement(["voyage","cuisine","escalade","equitation","soleil","sieste"]);
					birthdate = faker.date.between('1920-01-01', '2001-01-01');
					city = user.address.city;

					info_city = cities.filter(town => { return town.name.match('^' + city + '$')});
					country = info_city[0].country;
					zipcode = info_city[0].muniSub;
					latitude = info_city[0].loc.coordinates[1];
					longitude = info_city[0].loc.coordinates[0];

					bdd_pic.insert_info_user(id_user, gender, orientation, bio, interests, birthdate);
					bdd_pic.insert_info_user_localalisation(login, country, city, zipcode, longitude, latitude, () => {});
					bdd2.insert_log(id_user);
					bdd2.add_fakeVueLike(id_user);
					bdd_pic.savePic(id_user, image, profile);
					bdd_pic.isCompleted(id_user);
				});
			});
    	});
	})

}

module.exports = router;
