module.exports = function(app) {

    var pool = require('../../config/mysqldb')

    app.post('/persona/register', async function (req, res) {
        try {
            var country = await pool.query('SELECT * FROM luogo WHERE nome=?', [req.body.address.country.name])
            if(country.length == 0) { //nazione non esiste
                var country = await pool.query('INSERT INTO luogo (nome) VALUES (?)', [req.body.address.country.name])

                var region = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.region.name, country.insertId])
                var province = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.province.name, region.insertId])
                var city = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.city.name, province.insertId])
                var streetName = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.streetName, city.insertId])
                var homeNumber = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.homeNumber, streetName.insertId])
            } else { //nazione esiste
                var region = await pool.query('SELECT * FROM luogo WHERE nome=? AND luogo_idluogo=?', [req.body.address.region.name, country[0].idluogo])

                if(region.length == 0) { //regione non esiste
                    var region = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.region.name, country[0].idluogo])
                    var province = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.province.name, region.insertId])
                    var city = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.city.name, province.insertId])
                    var streetName = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.streetName, city.insertId])
                    var homeNumber = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.homeNumber, streetName.insertId])
                } else { //regione esiste
                    var province = await pool.query('SELECT * FROM luogo WHERE nome=? AND luogo_idluogo=?', [req.body.address.province.name, region[0].idluogo])

                    if(province.length == 0) { //provincia non esiste
                        var province = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.province.name, region[0].idluogo])
                        var city = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.city.name, province.insertId])
                        var streetName = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.streetName, city.insertId])
                        var homeNumber = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.homeNumber, streetName.insertId])
                    } else { //provincia esiste
                        var city = await pool.query('SELECT * FROM luogo WHERE nome=? AND luogo_idluogo=?', [req.body.address.city.name, province[0].idluogo])

                        if(city.length == 0) { //città non esiste
                            var city = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.city.name, province[0].idluogo])
                            var streetName = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.streetName, city.insertId])
                            var homeNumber = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.homeNumber, streetName.insertId])
                        } else { //città esiste
                            var streetName = await pool.query('SELECT * FROM luogo WHERE nome=? AND luogo_idluogo=?', [req.body.address.streetName, city[0].idluogo])

                            if(streetName.length == 0) { //via non esiste
                                var streetName = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.streetName, city[0].idluogo])
                                var homeNumber = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.homeNumber, streetName.insertId])
                            } else { //via esiste
                                var homeNumber = await pool.query('SELECT * FROM luogo WHERE nome=? AND luogo_idluogo=?', [req.body.address.homeNumber, streetName[0].idluogo])

                                if(homeNumber.length == 0) { //numciv non esiste
                                    var homeNumber = await pool.query('INSERT INTO luogo (nome, luogo_idluogo) VALUES (?, ?)', [req.body.address.homeNumber, streetName[0].idluogo])
                                } 
                            }
                        }
                    }
                }
            }

            if(homeNumber[0] != undefined) {
                var persona = await pool.query('INSERT INTO persona (codice_fiscale, nome, cognome, data_nascita, numero_telefono, email, luogo_idluogo) VALUES (?,?,?,?,?,?,?)', [req.body.ssn, req.body.name, req.body.surname, req.body.dob, req.body.phoneNumber, req.body.email, homeNumber[0].idluogo])
            } else {
                var persona = await pool.query('INSERT INTO persona (codice_fiscale, nome, cognome, data_nascita, numero_telefono, email, luogo_idluogo) VALUES (?,?,?,?,?,?,?)', [req.body.ssn, req.body.name, req.body.surname, req.body.dob, req.body.phoneNumber, req.body.email, homeNumber.insertId])
            }
            
            var manufacturer = await pool.query('SELECT * FROM produttore WHERE nome=?', [req.body.smartphone.manufacturer])
            if(manufacturer.length == 0) { //produttore non esiste
                var manufacturer = await pool.query('INSERT INTO produttore (nome) VALUES (?)', [req.body.smartphone.manufacturer])
                var model = await pool.query('INSERT INTO modello (nome, produttore_idproduttore) VALUES (?,?)', [req.body.smartphone.model, manufacturer.insertId])
                var smartphone = await pool.query('INSERT INTO smartphone (imei, modello_idmodello) VALUES (?,?)', [req.body.smartphone.imei, model.insertId])
                var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona.insertId, smartphone.insertId])
            } else { //produttore esiste
                var model = await pool.query('SELECT * FROM modello WHERE nome=? AND produttore_idproduttore=?', [req.body.smartphone.model, manufacturer[0].idproduttore])

                if(model.length == 0) { //modello non esiste
                    var model = await pool.query('INSERT INTO modello (nome, produttore_idproduttore) VALUES (?,?)', [req.body.smartphone.model, manufacturer[0].idproduttore])
                    var smartphone = await pool.query('INSERT INTO smartphone (imei, modello_idmodello) VALUES (?,?)', [req.body.smartphone.imei, model.insertId])
                    var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona.insertId, smartphone.insertId])
                } else { //modello esiste
                    var smartphone = await pool.query('SELECT * FROM smartphone WHERE imei=? AND modello_idmodello=?', [req.body.smartphone.imei, model[0].idmodello])

                    if(smartphone.length == 0) { //smartphone non esiste
                        var smartphone = await pool.query('INSERT INTO smartphone (imei, modello_idmodello) VALUES (?,?)', [req.body.smartphone.imei, model[0].idmodello])
                        var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona.insertId, smartphone.insertId])
                    } else { //smartphone esiste
                        var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona.insertId, smartphone[0].idsmartphone])
                    }
                }
            }
            res.status(200).send()
        } catch(err) {
            res.status(500).send();
            throw new Error(err)
        }
    });
}