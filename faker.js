let bdd = require('./models/confirm');
let bdd_pic = require('./models/about_you');
let bdd2 = require('./models/bdd_functions.js');

var faker = require('faker');
const router = require('express').Router();

router.route('/').get((req, res) => {
	var login = faker.internet.userName();
	var mail = faker.internet.email();
	var passwd = faker.internet.password();
	var fname = faker.name.firstName();
	var lname = faker.name.lastName();
	// console.log(login);
	// console.log(passwd);
	// console.log(fname);
	// console.log(lname);
	// console.log(mail);
	bdd.valide_user_fake(login, passwd, fname, lname, mail);


	var image = faker.internet.avatar();
	// console.log(image);
	bdd2.get_id_user(login,  (id_user) => {
		path = image;
		profile = 1;
		bdd_pic.savePic(id_user, path, profile);



	var gender = faker.random.arrayElement(["male","female","other"]);
	var orientation = faker.random.arrayElement(["men","women","everyone"]);
	var bio = faker.lorem.sentence();
	var interests = faker.random.arrayElement(["voyage","cuisine","escalade","equitation","soleil","sieste"]);
	// console.log(gender);
	// console.log(orientation);
	// console.log(bio);
	// console.log(interests);
	bdd_pic.insert_info_user(id_user, gender, orientation, bio, interests);




	});







	res.send("<p>Your on faker page");
});

module.exports = router;