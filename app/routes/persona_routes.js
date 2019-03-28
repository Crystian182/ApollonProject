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
            var i;
            for(i=0; i<result.length; i++) {
                var recapiti = await pool.query('SELECT * FROM recapito WHERE persona_idpersona = ?', result[i].idpersona);
                result[i].recapiti = recapiti
            }
            res.send(result)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.post('/persona', async function (req, res) {
        try {
            var result = await pool.query('INSERT INTO persona (nome, cognome, data_nascita) VALUES (?,?,?)', [req.body.nome, req.body.cognome, req.body.data_nascita])
            if(req.body.recapiti.length != 0) {
                var i;
                for(i = 0; i<req.body.recapiti.length; i++) {
                    await pool.query('INSERT INTO recapito (numero, persona_idpersona) VALUES (?,?)', [req.body.recapiti[i].numero, result.insertId])
                }
            }
            var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', result.insertId)
            var recapiti = await pool.query('SELECT * FROM recapito WHERE persona_idpersona = ?', result.insertId)
            persona[0].recapiti = recapiti
            res.send(persona)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.put('/persona', async function (req, res) {
        try {
            var result = await pool.query('UPDATE persona SET nome=?, cognome=?, data_nascita=? WHERE idpersona=?', [req.body.nome, req.body.cognome, req.body.data_nascita, req.body.idpersona])
            if(req.body.recapiti.length == 0) {
                await pool.query('DELETE FROM recapito WHERE persona_idpersona=?', req.body.idpersona)
            } else {
                var ids = [];
                var i;
                for(i = 0; i<req.body.recapiti.length; i++) {
                    if(req.body.recapiti[i].idrecapito != undefined) {
                        await pool.query('UPDATE recapito SET numero=? WHERE idrecapito=?', [req.body.recapiti[i].numero, req.body.recapiti[i].idrecapito])
                        ids.push(req.body.recapiti[i].idrecapito)
                    } else {
                        var result = await pool.query('INSERT INTO recapito (numero, persona_idpersona) VALUES (?,?)', [req.body.recapiti[i].numero, req.body.idpersona])
                        ids.push(result.insertId)
                    }
                }
                await pool.query('DELETE FROM recapito WHERE persona_idpersona=? AND idrecapito NOT IN (' + ids.join() + ')', [req.body.idpersona])
            }
            var persona = await pool.query('SELECT * FROM persona WHERE idpersona = ?', req.body.idpersona)
            res.send(persona)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

    app.delete('/persona/:idpersona', async function (req, res) {
        try {
            var result1 = await pool.query('DELETE FROM recapito WHERE persona_idpersona=?', req.params.idpersona)
            var result2 = await pool.query('DELETE FROM persona WHERE idpersona=?', req.params.idpersona)
            res.send(result2)
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });

}