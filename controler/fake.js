var fk = require('../models/fake.js');
const router = require('express').Router();

router.route('/:login').get((req, res) => {
    fk.add_faker(req.session.login, req.params.login);
    res.redirect('back');
});

module.exports = router;