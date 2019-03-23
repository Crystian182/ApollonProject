var mysql = require('mysql');
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

var pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'mydb'
});

var getConnection = function () {
    return pool.getConnectionAsync().disposer(function (connection) {
    return connection.destroy();
    });
   };

var query = function (command) {
    return using(getConnection(), function (connection) {
    return connection.queryAsync(command);
    });
};

module.exports = {
    query: query
};