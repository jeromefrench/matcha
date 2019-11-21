const router = require('express').Router();

router.route('/').get((req, res) => {
	res.render('localisation', )
});

router.route('/').get((req, res) => {
	res.redirect('/ip');
});


module.exports = router;
