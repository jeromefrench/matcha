const router = require('express').Router();
var conn = require('./models/connection_bdd.js');

savePic = function  (id_user, path, profile, callback){
	var sql = "INSERT INTO `photo` (`id_user`, `path_photo`, `profile`) VALUES (?, ?, ?);";
	var todo = [id_user, path, profile];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) {
			console.log(error);
			callback();
		}else {
			callback(result);
		}
	});
}


router.get('/', (req, res) => {
	savePic(3, "le_path", "le_profile", (result) => {
		console.log(result);
		res.send("salut");
	});
	// res.render('index', {test : 'Salut'});
});







module.exports = router;
