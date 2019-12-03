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

exports.IdBlocked = function(tab, id_user, id_block){
    var sql = "SELECT COUNT(*) AS 'count' FROM `block` WHERE `id_user` = ? AND `id_block` = ?";
    var todo = [id_user, id_block];
    conn.connection.query(sql, todo, (err, result) => {
        if (err) throw err;
        if (result[0].count > 0){
            console.log("id block ========================================================================= " + id_block);
            console.log(tab[0].id_user);
            tab = tab.filter(u => u.id_user !== id_block);
            console.log("apres");
            console.log(tab);
        }
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