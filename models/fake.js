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
    // var sql = "INSERT INTO `report_fake` (`id_user`, `id_faker`) VALUES (?, ?)";
    // var todo = [user_log, user_fake];
    // conn.connection.query(sql, todo, (err) => {
    //     if (err) throw err;
    //     console.log('faker signalé');
    // });
}