const router = require('express').Router();
let notif = require('../models/notifications.js');
var bdd = require('../models/account.js');

router.route('/').get(async (req, res) => {
	var result = await notif.get_notif(req.session.login);
	bell = 0;
	var userId = await bdd.get_id_user(req.session.login);
	var sql = "UPDATE `notifications` SET `lu` = 1 WHERE `id_user_i_send` = ?";
	var todo = [userId];
	var done = await db.query(sql, todo);
	res.locals.notifs = result;
	res.render('main_view/notification.ejs');
});

module.exports = router;
