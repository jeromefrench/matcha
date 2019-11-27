let bdd = require('./models/confirm');
let bdd_pic = require('./models/about_you');
let bdd2 = require('./models/bdd_functions.js');

// var faker = require('faker');
var cities = require("all-the-cities");
const router = require('express').Router();
var faker = require('faker/locale/fr');
var Fakerator = require('fakerator');
var fakerator = Fakerator("fr-FR");

router.route('/').get((req, res) => {
	var user = fakerator.entity.user();
	var login = user.userName;
	var mail = user.email;
	var passwd = user.password;
	var fname = user.firstName;
	var lname = user.lastName;
	console.log(user);

	bdd.valide_user_fake(login, passwd, fname, lname, mail, ()=> {
		var image = faker.internet.avatar();
	
		bdd2.get_id_user(login, (id_user) => {
			path = image;
			profile = 1;
			bdd_pic.savePic(id_user, path, profile);
	
			var gender = faker.random.arrayElement(["male","female","other"]);
			var orientation = faker.random.arrayElement(["men","women","everyone"]);
			var bio = faker.lorem.sentence();
			var interests = faker.random.arrayElement(["voyage","cuisine","escalade","equitation","soleil","sieste"]);
			var birthdate = faker.date.between('1920-01-01', '2001-01-01');
			var city = user.address.city;
			
			var info_city = cities.filter(town => { return town.name.match('^' + city + '$')});
			var country = info_city[0].country;
			var zipcode = info_city[0].muniSub;
			var latitude = info_city[0].loc.coordinates[1];
			var longitude = info_city[0].loc.coordinates[0];
			
			bdd_pic.insert_info_user(id_user, gender, orientation, bio, interests, birthdate);
			bdd_pic.insert_info_user_localalisation(login, country, city, zipcode, longitude, latitude, () => {});
			bdd2.insert_log(id_user);
			bdd2.add_fakeVueLike(id_user);
		});
		res.send("<p>Your on faker page");
	});
	});

module.exports = router;