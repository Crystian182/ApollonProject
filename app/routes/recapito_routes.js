module.exports = function(app) {

    var pool = require('../../config/mysqldb')

    app.get('/recapito/:idrecapito', async function (req, res) {
        try {
            var result = await pool.query('SELECT * FROM recapito WHERE idrecapito = ?', req.params.idrecapito)
            var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', result[0].persona_idpersona)
            result[0].persona = persona[0]
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.get('/recapito', async function (req, res) {
        try {
            var result = await pool.query('SELECT * FROM recapito')
            var i;
            for(i = 0; i<result.length; i++) {
                var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', result[i].persona_idpersona)
                result[i].persona = persona[0]
            }
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.get('/recapito/getbyidpersona/:idpersona', async function (req, res) {
        try {
            var result = await pool.query('SELECT * FROM recapito WHERE persona_idpersona = ?', req.params.idpersona)
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.post('/recapito', async function (req, res) {
        try {
            var result = await pool.query('INSERT INTO recapito (numero, persona_idpersona) VALUES (?,?)', [req.body.numero, req.body.idpersona])
            var recapito = await pool.query('SELECT * FROM recapito WHERE idrecapito = ?', result.insertId)
            var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', recapito[0].persona_idpersona)
            recapito[0].persona = persona[0]
            res.send(recapito)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.put('/recapito', async function (req, res) {
        try {
            var result = await pool.query('UPDATE recapito SET numero=? WHERE idrecapito=?', [req.body.numero, req.body.idrecapito])
            var recapito = await pool.query('SELECT * FROM recapito WHERE idrecapito = ?', req.body.idrecapito)
            var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', recapito[0].persona_idpersona)
            recapito[0].persona = persona[0]
            res.send(recapito)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.delete('/recapito/:idrecapito', async function (req, res) {
        try {
            var result = await pool.query('DELETE FROM recapito WHERE idrecapito=?', req.params.idrecapito)
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

}