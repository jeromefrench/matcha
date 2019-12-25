const router = require('express').Router();
let notif = require('../models/notifications.js');
var bdd = require('../models/account.js');

router.route('/').get(async (req, res) => {
    result = await notif.get_notif(req.session.login);
	bell = 0;
	userId = bdd.get_id_user(req.session.login);
	var sql = "UPDATE `notifications` SET `lu` = 1 WHERE `id_user_i_send` = ?";
	var todo = [userId];
	done = await db.query(sql, todo);
	console.log(result);
	res.locals.notifs = result;
	res.render('notifications', {session:req.session});
    // console.log(result);
    // res.locals.notifs = result;
 	// res.render('notifications', {session:req.session});
});

module.exports = router;
