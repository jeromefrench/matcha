"use strict";
const router = require('express').Router();

router.route('/').get((req, res) => {
	try {
	req.session.logon = false;
	req.session.login = undefined;
	req.session.token = undefined;
	res.locals.token = undefined;
	users = users.filter(u => u.id == req.session.id);
	res.redirect('/sign-in');
	}
	catch (err){
		console.error(err);
		res.redirect('/error');
	}
});

module.exports = router;
