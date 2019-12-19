let bdd = require('../models/account.js');
var bdd_func = require('../models/bdd_functions.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/:login/:num').get((req, res) => {
	login = req.params.login;
	num = req.params.num;

	bdd_func.IsLoginNumMatch(login, num, "user_sub", (suspense) => {
		if (suspense){
			bdd.recover_user_data(num, (data) => {
				bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail, num, (ok) => {
					bdd.save_connection_log(login);
					bdd.notification(login, (user_id) =>{
						const user = { id: user_id, username: login};
						let jwtToken = jwt.sign(user, 'secretkey');
						req.session.token = jwtToken;
						req.session.first_log = true;
						req.session.logon = true;
						req.session.login = login;
						req.session.ans['notification_general'] = "Your account is validated please fill your profile"
						res.redirect('/about-you');
					});
				});
			});
		}
		else{
			req.session.ans['notification_general'] = "Sorry something wrong happen"
			res.redirect('/sign-in');
		}
	});
});

module.exports = router;
