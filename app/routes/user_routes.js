module.exports = function(app, db) {

    var db = require('../../config/mysqldb');
    var mysql = require('mysql');
  
    app.get('/users/:id', function (req, res) {
        return getUserById(req.params.id).then(function (r) {
            return res.send(r);
        });
    });

    var getUserById = function(id) {
        var params = [id];
        var query = 'SELECT * FROM users WHERE id = ? LIMIT 1;';
        return db.query(mysql.format(query, params)).then(function (r) {
            return r;
        });
    }

}