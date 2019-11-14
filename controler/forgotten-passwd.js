let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_send_passGet = function send_pass(req, res){
    res.locals.title = "Forgotten Password";
    res.render('forgotten-passwd.ejs', {session: req.session});
}