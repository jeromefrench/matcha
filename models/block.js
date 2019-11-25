var conn = require('./connection_bdd.js');
var bdd = require('./bdd_functions.js');

exports.block_user = function(user_log, user_block){
    bdd.get_id_user(user_log, (id_log) => {
        bdd.get_id_user(user_block, (id_block) => {
            var sql = "INSERT INTO `block` (`id_user`, `id_block`) VALUES (?, ?)";
            var todo = [id_log, id_block];
            conn.connection.query(sql, todo, (err) => {
                if (err) throw err;
                console.log('UTILISATEUR BLOQUE');
            });
        });
    });
}

exports.IsBlocked = function(user_log, user_block, callback){
    bdd.get_id_user(user_log, (id_log) => {
        bdd.get_id_user(user_block, (id_block) => {
            var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
            var todo = [id_log, id_block];
            conn.connection.query(sql, todo, (err, result) => {
                if (err) throw err;
                if (result[0].count > 0){
                    callback(true);
                }
                else{
                    callback(false);
                }
            });
        })
    });
}