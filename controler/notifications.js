"use strict";
const router = require('express').Router();
let notif = require('../models/notifications.js');
var bdd = require('../models/account.js');

router.route('/').get(async (req, res) => {
	try {
		var result = await notif.get_notif(req.session.login);
		console.log("------------");
		console.log("notif");
		console.log(result);
		bell = 0;
		var userId = await bdd.get_id_user(req.session.login);
		var sql = "UPDATE `notifications` SET `lu` = 1 WHERE `id_user_i_send` = ?";
		var todo = [userId];
		var done = await db.query(sql, todo);
		res.locals.notifs = result;
		res.render('main_view/notifications.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
