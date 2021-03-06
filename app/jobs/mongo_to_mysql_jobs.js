module.exports = function(mongodb) {
    let cron = require('cron');
    var pool = require('../../config/mysqldb');
    var checkpoint = true;

    let countJob = new cron.CronJob({
        cronTime : '0 0 */1 * * *',  // The time pattern when you want the job to start
        onTick : dbTransfer, // Task to run
        start : true, // immediately starts the job.
    });

    //cronTime : '0 */3 * * * *',

    async function dbTransfer(){
        console.log("running task " + new Date())
       
        try{
            //let i = 0;
            var date = new Date();
            
            
            /* MOCK DATE */
            //var timestamp = new Date("2019-05-31T07:00:00.458Z")
            //var userTimezoneOffset = timestamp.getTimezoneOffset() * 60000;
            //var date = new Date(timestamp.getTime() - userTimezoneOffset);
            /*************/

            var currentDate = getFormattedDate(date)
            var oneHourBackDate = getOneHourBackDate(date);

            const misurazioni = await mongodb.collection('misurazioni').find( { "timestamp": { $gte: oneHourBackDate, $lt: currentDate } }).toArray();
            //const misurazioni = await mongodb.collection('misurazioni').find().toArray();
            //const misurazioni = [];
            //console.log(misurazioni.length)
            if(misurazioni.length != 0 && checkpoint) {
                checkpoint=false;
                for(let m of misurazioni) {
                    //console.log(i)
                    //i=i+1
                    var persona = await pool.query('SELECT * FROM persona WHERE persona.email=?', m.userID);

                    /************** PERSONA ***************/
                    var smartphone = await pool.query('SELECT * FROM smartphone WHERE smartphone.imei=?', m.phoneInfo.imei);

                    if(smartphone.length == 0) { //smartphone non esiste
                        var manufacturer = await pool.query('SELECT * FROM produttore WHERE nome=?', [m.phoneInfo.manufacturer])
                        if(manufacturer.length == 0) { //produttore non esiste
                            var manufacturer = await pool.query('INSERT INTO produttore (nome) VALUES (?)', [m.phoneInfo.manufacturer])
                            var model = await pool.query('INSERT INTO modello (nome, produttore_idproduttore) VALUES (?,?)', [m.phoneInfo.model, manufacturer.insertId])
                            var smartphone = await pool.query('INSERT INTO smartphone (imei, modello_idmodello) VALUES (?,?)', [m.phoneInfo.imei, model.insertId])
                            var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona[0].idpersona, smartphone.insertId])
                        } else { //produttore esiste
                            var model = await pool.query('SELECT * FROM modello WHERE nome=? AND produttore_idproduttore=?', [m.phoneInfo.model, manufacturer[0].idproduttore])

                            if(model.length == 0) { //modello non esiste
                                var model = await pool.query('INSERT INTO modello (nome, produttore_idproduttore) VALUES (?,?)', [m.phoneInfo.model, manufacturer[0].idproduttore])
                                var smartphone = await pool.query('INSERT INTO smartphone (imei, modello_idmodello) VALUES (?,?)', [m.phoneInfo.imei, model.insertId])
                                var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona[0].idpersona, smartphone.insertId])
                            } else { //modello esiste
                                var smartphone = await pool.query('SELECT * FROM smartphone WHERE imei=? AND modello_idmodello=?', [m.phoneInfo.imei, model[0].idmodello])

                                if(smartphone.length == 0) { //smartphone non esiste
                                    var smartphone = await pool.query('INSERT INTO smartphone (imei, modello_idmodello) VALUES (?,?)', [m.phoneInfo.imei, model[0].idmodello])
                                    var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona[0].idpersona, smartphone.insertId])
                                } else { //smartphone esiste
                                    var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona[0].idpersona, smartphone[0].idsmartphone])
                                }
                            }
                        }
                        var smartphone = await pool.query('SELECT * FROM smartphone WHERE smartphone.imei=?', m.phoneInfo.imei);
                    } else {
                        var owner = await pool.query('SELECT * FROM persona_has_smartphone WHERE persona_idpersona=? AND smartphone_idsmartphone=?', [persona[0].idpersona, smartphone[0].idsmartphone])
                        
                        if(owner.length == 0) { //questa persona non possiede lo smartphone
                            var owner = await pool.query('INSERT INTO persona_has_smartphone (persona_idpersona, smartphone_idsmartphone) VALUES (?,?)', [persona[0].idpersona, smartphone[0].idsmartphone])
                        }
                    }
                    /**************************************/

                    /**************** GPS *****************/
                    var gps =  await pool.query('SELECT * FROM misurazione_gps WHERE latitudine=? AND longitudine=?',[m.gpsMeasure.lat.value,  m.gpsMeasure.lng.value])
                    if(gps.length == 0) { //coord gps non esistono
                        gps =  await pool.query('INSERT INTO misurazione_gps (latitudine,longitudine) VALUES(?,?)',[m.gpsMeasure.lat.value,  m.gpsMeasure.lng.value])
                        gps =  await pool.query('SELECT * FROM misurazione_gps WHERE latitudine=? AND longitudine=?',[m.gpsMeasure.lat.value,  m.gpsMeasure.lng.value])
                    }
                    /**************************************/
                    
                    var report = await pool.query('INSERT INTO report (data_report, data_localizzazione, smartphone_idsmartphone, persona_idpersona, misurazione_gps_idmisurazione_gps) VALUES(?,?,?,?,?)', [getSQLDate(m.timestamp), getSQLDate(m.gpsMeasure.timestamp), smartphone[0].idsmartphone, persona[0].idpersona, gps[0].idmisurazione_gps])

                    /********** CAMPO MAGNETICO  **********/
                    var unit_measure_em = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', m.emMeasure.unitMeasurement.name)
                    if(unit_measure_em.length == 0) { //unita misura non esiste
                        unit_measure_em = await pool.query('INSERT INTO unita_misura (nome) VALUES (?)', m.emMeasure.unitMeasurement.name)
                        unit_measure_em = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', m.emMeasure.unitMeasurement.name)
                    } 

                    var em_measure = await pool.query('INSERT INTO misurazione_campo_magnetico (valore, unita_misura_idunita_misura, report_idreport) VALUES(?,?,?)',[m.emMeasure.value, unit_measure_em[0].idunita_misura, report.insertId])
                    /**************************************/

                    /**************** RETE ****************/
                    var unit_measure_network = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', m.networkMeasure.measure.unitMeasurement.name)
                    if(unit_measure_network.length == 0) { //unita di misura non esiste
                        unit_measure_network = await pool.query('INSERT INTO unita_misura (nome) VALUES (?)', m.networkMeasure.measure.unitMeasurement.name)
                        unit_measure_network = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', m.networkMeasure.measure.unitMeasurement.name)
                    }

                    var carrier = await pool.query('SELECT * FROM gestore WHERE gestore.nome=?', m.simInfo.carrier)
                    if(carrier.length == 0) { //gestore non esiste
                        carrier = await pool.query('INSERT INTO gestore (nome) VALUES(?)', m.simInfo.carrier)
                        carrier = await pool.query('SELECT * FROM gestore WHERE gestore.nome=?', m.simInfo.carrier)
                    }

                    var misurazione_rete = await pool.query('INSERT INTO misurazione_rete_cellulare (valore, stato_rete_dati, unita_misura_idunita_misura, gestore_idgestore, report_idreport) VALUES(?,?,?,?,?)',[m.networkMeasure.measure.value, m.networkMeasure.dataState, unit_measure_network[0].idunita_misura, carrier[0].idgestore, report.insertId])

                    var generazione_voce = await pool.query('SELECT * FROM generazione WHERE nome=?', m.networkMeasure.voiceNetwork.generation)
                    if(generazione_voce.length == 0) {
                        generazione_voce = await pool.query('INSERT INTO generazione (nome) VALUES(?)', m.networkMeasure.voiceNetwork.generation)
                        generazione_voce = await pool.query('SELECT * FROM generazione WHERE nome=?', m.networkMeasure.voiceNetwork.generation)
                    }

                    var generazione_dati = await pool.query('SELECT * FROM generazione WHERE nome=?', m.networkMeasure.dataNetwork.generation)
                    if(generazione_dati.length == 0) {
                        generazione_dati = await pool.query('INSERT INTO generazione (nome) VALUES(?)', m.networkMeasure.dataNetwork.generation)
                        generazione_dati = await pool.query('SELECT * FROM generazione WHERE nome=?', m.networkMeasure.dataNetwork.generation)
                    }
                    
                    var rete_voce = await pool.query('SELECT * FROM rete WHERE rete.nome=?', m.networkMeasure.voiceNetwork.name)
                    if(rete_voce.length == 0) {
                        rete_voce = await pool.query('INSERT INTO rete (nome, generazione_idgenerazione) VALUES(?,?)', [m.networkMeasure.voiceNetwork.name, generazione_voce[0].idgenerazione])
                        rete_voce = await pool.query('SELECT * FROM rete WHERE rete.nome=?', m.networkMeasure.voiceNetwork.name)
                    }

                    var rete_dati = await pool.query('SELECT * FROM rete WHERE rete.nome=?', m.networkMeasure.dataNetwork.name)
                    if(rete_dati.length == 0) {
                        rete_dati = await pool.query('INSERT INTO rete (nome, generazione_idgenerazione) VALUES(?,?)', [m.networkMeasure.dataNetwork.name, generazione_dati[0].idgenerazione])
                        rete_dati = await pool.query('SELECT * FROM rete WHERE rete.nome=?', m.networkMeasure.dataNetwork.name)
                    }

                    var tipo_rete_voce = await pool.query('SELECT * FROM tipo_rete WHERE tipo_rete.descrizione="Voce"')
                    var tipo_rete_dati = await pool.query('SELECT idtipo_rete FROM tipo_rete WHERE tipo_rete.descrizione="Dati"')

                    var misurazione_has_rete_voce = await pool.query('INSERT INTO misurazione_rete_cellulare_has_rete (misurazione_rete_cellulare_idmisurazione_rete_cellulare, rete_idrete, tipo_rete_idtipo_rete) VALUES(?,?,?)',[misurazione_rete.insertId, rete_voce[0].idrete, tipo_rete_voce[0].idtipo_rete])
                    var misurazione_has_rete_dati = await pool.query('INSERT INTO misurazione_rete_cellulare_has_rete (misurazione_rete_cellulare_idmisurazione_rete_cellulare, rete_idrete, tipo_rete_idtipo_rete) VALUES(?,?,?)',[misurazione_rete.insertId, rete_dati[0].idrete, tipo_rete_dati[0].idtipo_rete])
                    /**************************************/

                    /*************** WIFI *****************/
                    var wifi = await pool.query('INSERT INTO misurazione_wifi (stato_antenna, report_idreport) VALUES(?,?)',[m.isWiFiEnabled, report.insertId])
                    
                    if(m.wifiMeasure != undefined) {
                        for(let w of m.wifiMeasure){
                            var unit_measure_freq = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', w.frequencyMeasure.unitMeasurement.name)
                            if(unit_measure_freq.length == 0) { //unita misura non esiste
                                unit_measure_freq = await pool.query('INSERT INTO unita_misura (nome) VALUES(?)', w.frequencyMeasure.unitMeasurement.name)
                                unit_measure_freq = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', w.frequencyMeasure.unitMeasurement.name)
                            }
                            
                            var unit_measure_wifi = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', w.dBmMeasure.unitMeasurement.name)
                            if(unit_measure_wifi.length == 0) { //unita misura non esiste
                                unit_measure_wifi = await pool.query('INSERT INTO unita_misura (nome) VALUES(?)', w.dBmMeasure.unitMeasurement.name)
                                unit_measure_wifi = await pool.query('SELECT * FROM unita_misura WHERE unita_misura.nome=?', w.dBmMeasure.unitMeasurement.name)
                            }
                            
                            var frequency = await pool.query('SELECT * FROM frequenza WHERE valore=? AND canale=? AND unita_misura_idunita_misura=?',[w.frequencyMeasure.value, w.channel, unit_measure_freq[0].idunita_misura])

                            if(frequency.length == 0) { //frequenza non esiste
                                frequency = await pool.query('INSERT INTO frequenza (valore, canale, unita_misura_idunita_misura) VALUES(?,?,?)',[w.frequencyMeasure.value, w.channel, unit_measure_freq[0].idunita_misura])
                                frequency = await pool.query('SELECT * FROM frequenza WHERE valore=? AND canale=? AND unita_misura_idunita_misura=?',[w.frequencyMeasure.value, w.channel, unit_measure_freq[0].idunita_misura])
                            }
                            
                            var rete_wifi = await pool.query('INSERT INTO rete_wifi (SSID, valore, unita_misura_idunita_misura, frequenza_idfrequenza, misurazione_wifi_idmisurazione_wifi) VALUES(?,?,?,?,?)',[w.SSID, w.dBmMeasure.value, unit_measure_wifi[0].idunita_misura, frequency[0].idfrequenza, wifi.insertId])
                        }
                    }
                    /**************************************/

                }
            }
            checkpoint = true;
        } catch (err){
            console.log(err)
        }

            //console.log("finish")
    };


    function getOneHourBackDate(date) {
        var newDate = getFormattedDate(date)
        newDate.setTime(newDate.getTime() - (60*60*1000))
        return new Date(newDate.toISOString());
    }

    function getSQLDate(date) {
        /*console.log(date)
        console.log(getFormattedDate(date).toISOString().substring(0,10) + " " +
        getFormattedDate(date).toISOString().substring(11,19))*/
        //console.log(date)
        //console.log(date.toISOString().substring(0, date.toISOString().length-5))
        return date.toISOString().substring(0, date.toISOString().length-5)
        /*return getFormattedDate(date).toISOString().substring(0,10) + " " +
            getFormattedDate(date).toISOString().substring(11,19);*/
    }

    function getFormattedDate(date) {
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset);
    }
    


};