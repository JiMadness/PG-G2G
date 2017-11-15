var exports = module.exports = {};
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100000, //important
    host: 'oct-localapps02.na.pg.com',
    port: 8888,
    user: 'admin',
    password: 'admin',
    database: 'vps'
});
exports.query = function (sql, info, callback) {
    var query;
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return;
        }
        if (info != null)
            connection.query(sql, info, callback);
        else
            connection.query(sql, callback);
        connection.release();
        return query;
    });
};