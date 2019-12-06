var conn = require('../models/connection_bdd.js');

const router = require('express').Router();
let notif = require('../models/notifications.js');
var bdd = require('../models/bdd_functions.js');

router.route('/').get((req, res) => {
    notif.get_notif(req.session.login, (result) => {
		bell = 0;
		bdd.get_id_user(req.session.login, (userId) => {
			var sql = "UPDATE `notifications` SET `lu` = 1 WHERE `id_user_i_send` = ?";
			var todo = [userId];
			conn.connection.query(sql, todo, (err) => {
				if (err) {console.log(err);}
				console.log(result);
				res.locals.notifs = result;
				res.render('notifications', {session:req.session});
			});
		});
    	// console.log(result);
    	// res.locals.notifs = result;
 		// res.render('notifications', {session:req.session});
    });
});

module.exports = router;
