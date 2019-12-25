var bl = require('../models/interractions.js');
const router = require('express').Router();

router.route('/:login').get((req, res) => {
    bl.block_user(req.session.login, req.params.login);
    res.redirect('back');
});

module.exports = router;
