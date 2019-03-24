module.exports = function(app) {

    var pool = require('../../config/mysqldb')

    app.get('/persona/:idpersona', async function (req, res) {
        try {
            var result = await pool.query('SELECT * FROM persona WHERE idpersona = ?', req.params.idpersona)
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.get('/persona', async function (req, res) {
        try {
            var result = await pool.query('SELECT * FROM persona')
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.post('/persona', async function (req, res) {
        try {
            var result = await pool.query('INSERT INTO persona (nome, cognome, data_nascita) VALUES (?,?,?)', [req.body.nome, req.body.cognome, req.body.data_nascita])
            var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', result.insertId)
            res.send(persona)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.put('/persona', async function (req, res) {
        try {
            var result = await pool.query('UPDATE persona SET nome=?, cognome=?, data_nascita=? WHERE idpersona=?', [req.body.nome, req.body.cognome, req.body.data_nascita, req.body.idpersona])
            var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', req.body.idpersona)
            res.send(persona)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.delete('/persona/:idpersona', async function (req, res) {
        try {
            var result = await pool.query('DELETE FROM persona WHERE idpersona=?', req.params.idpersona)
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

}