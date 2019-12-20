const router = require('express').Router();

router.route('/').get((req, res) => {
	req.session.logon = false;
	req.session.login = undefined;
	req.session.token = undefined;
	res.locals.token = undefined;
	users = users.filter(u => u.id == req.session.id);
	res.redirect('/sign-in');
});

module.exports = router;
