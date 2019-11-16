var faker = require('faker');


module.exports.faker = function (req, res){

var randomName = faker.name.findName();

	console.log(randomName);



	//remplire table user
	//remplire table user info
	//remplire table photo



	res.send("<p>Your on faker page");
}
