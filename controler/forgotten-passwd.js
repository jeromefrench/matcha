let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_send_passGet = function send_passGet(req, res){
    res.locals.title = "Forgotten Password";
    res.render('forgotten-passwd.ejs', {session: req.session});
}

module.exports.ctrl_send_passPost = function send_passPost(req,res){
    var email = req.body.email;
    console.log(email);
        bdd.send_passwd(email, (result) => {
            if (result == 0){
                req.session.mailexist == 3;
            }
            else if (result == 2){
                req.session.mailexist == 2;
            }
            res.redirect('/forgotten-passwd');
        });
}