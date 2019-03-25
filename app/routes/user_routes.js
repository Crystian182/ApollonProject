module.exports = function(app) {

    var pool = require('../../config/mysqldb')

    app.get('/users/:id', async function (req, res) {
        try {
            var result = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id)
            res.send(result)
        } catch(err) {
            throw new Error(err)
        }
    });

}