let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_signUpGet = function signUpGet(req, res){
    res.locals.title = "Sign Up";
    res.render('sign-up.ejs', {session: req.session});
}


module.exports.ctrl_signUpPost = function signUpPost(req, res){
    var lname = req.body.lastname;
    var fname = req.body.firstname;
    var email = req.body.email;
    var login = req.body.login;
    var passwd = req.body.passwd;
    // bdd.insert_user(login, passwd, fname, lname, email, (login, email) => {
        bdd.check_log_exist(login, function (log){
            if (log != 0)
                console.log("login exists");
            else 
                console.log("login doesnt exist");
        });
    // });
}
