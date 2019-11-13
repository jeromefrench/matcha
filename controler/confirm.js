let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_confirmGet = function confirmGet(req, res){
    res.locals.title = "Welcome " + req.params.login + "!";
    bdd.recover_user_data(req.params.num, (data) => {
        bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail);
    });
    res.render('confirm.ejs');
}