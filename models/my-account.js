var conn = require('./connection_bdd.js');

exports.change_log_mail = function(oldlog, login, email, callback){
    console.log("oldlog = " + oldlog);
    console.log("log = " + login);
    console.log("email = " + email);
    var sql = "UPDATE `user` SET `login` = ?, `mail` = ? WHERE `login` = ?";
    var todo = [login, email, oldlog];
    conn.connection.query(sql, todo, (err) => {
        if (err){console.log(err);}
        else {
            console.log("USER UPDATED");
            callback();
        }
    });
}