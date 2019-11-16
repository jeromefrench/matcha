let bdd = require('../models/forgotten-passwd.js');

module.exports.ctrl_send_passGet = function send_passGet(req, res){
    res.locals.title = "Forgotten Password";
    if (req.session.fpOk == 1){
        res.render('fp_envoye.ejs');
    }
    else{
        res.render('forgotten-passwd.ejs', {session: req.session});
    }
}

module.exports.ctrl_send_passPost = function send_passPost(req,res){
    var email = req.body.email;
    req.session.mailexist = 0;
    req.session.fpOk = 0;
    bdd.send_passwd(email, (result) => {
        console.log("result=" + result);
        if (result == 0){
            req.session.mailexist = 3;
        }
        else if (result == 2){
            req.session.mailexist = 2;
        }
        else if (result == 1){
            req.session.fpOk = 1;
        }
        res.redirect('/forgotten-passwd');
    });
}