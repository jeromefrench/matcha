
const router = require('express').Router();
let bdd = require('../models/dashboard.js');

router.route('/').get((req, res) => {
 		res.render('notifications', {session:req.session});
});

module.exports = router;
