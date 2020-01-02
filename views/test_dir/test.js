const router = require('express').Router();

router.route('/about_you').get(async (req, res) => {


	res.render('test_dir/about_you.ejs');



});


module.exports = router;
