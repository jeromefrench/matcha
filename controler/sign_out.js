const router = require('express').Router();

router.route('/').get((req, res) => {
	req.session.logon = false;
	req.session.login = undefined;
	res.redirect('/sign-in');
});

module.exports = router;