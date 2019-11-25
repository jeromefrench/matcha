var conn = require('./connection_bdd.js');
var bdd = require('./bdd_functions.js');

exports.add_faker = function(user_log, user_fake){
    bdd.get_id_user(user_log, (id_log) => {
        bdd.get_id_user(user_fake, (id_fake) => {
            var sql = "INSERT INTO `report_fake` (`id_user`, `id_faker`) VALUES (?, ?)";
            var todo = [id_log, id_fake];
            conn.connection.query(sql, todo, (err) => {
                if (err) throw err;
                console.log('faker signalé');
            });
        });
    });
}

exports.IsReport = function(user_log, user_fake, callback){
    bdd.get_id_user(user_log, (id_log) => {
        bdd.get_id_user(user_fake, (id_fake) => {
            var sql = "SELECT COUNT(*) AS 'count' FROM `report_fake` WHERE `id_user` = ? AND `id_faker` = ?";
            var todo = [id_log, id_fake];
            conn.connection.query(sql, todo, (err, result) => {
                if (err) throw err;
                if (result[0].count > 0){
                    callback(true);
                }
                else{
                    callback(false);
                }
            });
        });
    });
}