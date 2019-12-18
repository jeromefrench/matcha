let bdd = require('../models/forgotten-passwd.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
    res.locals.title = "Forgotten Password";
    if (req.session.fpOk == 1){
        req.session.fOk = 0;
        req.session.mlexist = undefined;
        res.render('fp_envoye.ejs', {session: req.session});
    }
    else{
        res.render('forgotten-passwd.ejs', {session: req.session});
    }
});

router.route('/').post((req, res) => {
    var email = req.body.email;
    req.session.mlexist = 0;
    req.session.fpOk = 0;
    bdd.send_passwd(email, (result) => {
        console.log("result=" + result);
        if (result == 0){
            req.session.mlexist = 3;
        }
        else if (result == 2){
            req.session.mlexist = 2;
        }
        else if (result == 1){
            req.session.fpOk = 1;
        }
        res.redirect('/forgotten-passwd');
    });
});

module.exports = router;