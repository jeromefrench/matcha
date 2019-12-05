
const router = require('express').Router();
let bdd = require('../models/notifications.js');

router.route('/').get((req, res) => {
    bdd.get_notif(req.session.login, (result) => {
    	console.log(result);
    	res.locals.notifs = result;
 		res.render('notifications', {session:req.session});
    })
});

module.exports = router;
