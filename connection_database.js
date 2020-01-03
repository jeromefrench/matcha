
const util = require( 'util' );
const mysql = require( 'mysql' );

 config = { host     : '192.168.99.100',
 			user     : 'root',
 			password : 'tiger',
 			port	: '3306',
 			database : 'docker' };


// config = { host     : 'localhost',
// 			user     : 'newuser',
// 			password : 'rootpasswd',
// 			port	: '3306',
// 			database : 'docker' };

exports.makeConn = function (config){
  const connection = mysql.createConnection( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}
