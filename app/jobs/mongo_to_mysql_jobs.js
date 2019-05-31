module.exports = function(mongodb) {
    let cron = require('cron');
    var pool = require('../../config/mysqldb');

    let countJob = new cron.CronJob({
        cronTime : '* * * * *',  // The time pattern when you want the job to start
        onTick : runTask, // Task to run
        start : true, // immediately starts the job.
    });

    async function runTask(){
        console.log("running task")
        try{
            const misurazioni = await mongodb.collection('misurazioni').find( { "timestamp": { $gt: ISODate('1950-01-01') } }).toArray();
        
            //loop query su m
            /*for(let m of misurazioni) {
                //take smartphone id
                var smart = await pool.query('SELECT idsmartphone FROM smartphone WHERE smartphone.imei=?', m.phoneInfo.imei)
            
                //query report 
                var report = await pool.query('INSERT INTO report (data_report, data_ricezione, smartphone_idsmartphone) VALUES(?,?,?)', [m.timestamp, new Date().toLocaleString(), smart[0].idsmartphone])
                console.log(report)

                //take unit measure em id
                var unit_measure_em = await pool.query('SELECT idunita_misura FROM unita_misura WHERE unita_misura.nome=?', m.emMeasure.unitMeasurement.name)
                if(unit_measure_em == []){
                    unit_measure_em = await pool.query('INSERT INTO unita_misura (nome) VALUES (?)', m.emMeasure.unitMeasurement.name)
                    //query EM
                    var EM = await pool.query('INSERT INTO misurazione_campo_magnetico (valore, unita_misura_idunita_misura, report_idreport) VALUES(?,?,?)',[m.emMeasure.value, unit_measure_em.insertId, report.insertId])
                    console.log(EM)
                }
                else{
                    //query EM
                    var EM = await pool.query('INSERT INTO misurazione_campo_magnetico (valore, unita_misura_idunita_misura, report_idreport) VALUES(?,?,?)',[m.emMeasure.value, unit_measure_em[0].idunita_misura, report.insertId])
                    console.log(EM)
                }
            
                //take luogo

                //query gps (manca luogo)
                var gps =  await pool.query('INSERT INTO misurazione_gps (data_localizzazione, latitudine, longitudine, luogo_idluogo, report_idreport) VALUES(?,?,?,?,?)',[m.gpsMeasure.timestamp, m.gpsMeasure.lat.value,  m.gpsMeasure.lng.value, report.insertId])

                //take unit measure rete id
                var unit_measure_network = await pool.query('SELECT idunita_misura FROM unita_misura WHERE unita_misura.nome=?', m.networkMeasure.measure.unitMeasurement.name)
                if(unit_measure_network == []){
                    unit_measure_network = await pool.query('INSERT INTO unita_misura (nome) VALUES (?))', m.networkMeasure.measure.unitMeasurement.name)
                    var id_unita_misura_rete = unit_measure_network.insertId
                }
                else{
                    var id_unita_misura_rete = unit_measure_network[0].idunita_misura
                }

                //take id carrier
                var carrier = await pool.query('SELECT idgestore FROM gestore WHERE gestore.nome=?', m.networkMeasure.simInfo.carrier)
                console.log(carrier)
                if(carrier == []){
                    carrier = await pool.query('INSERT INTO gestore (nome) VALUES(?)', m.networkMeasure.simInfo.carrier)
                    //query misurazione rete cellulare
                    var misurazione_rete = await pool.query('INSERT INTO misurazione_rete_cellulare (valore, stato_rete_dati, unita_misura_idunita_misura, gestore_idgestore, report_idreport) VALUES(?,?,?,?,?)',[m.networkMeasure.measure.value, m.networkMeasure.dataState,  id_unita_misura_rete, carrier.insertId, report.insertId])
                }
                else{
                    //query misurazione rete cellulare
                    var misurazione_rete = await pool.query('INSERT INTO misurazione_rete_cellulare (valore, stato_rete_dati, unita_misura_idunita_misura, gestore_idgestore, report_idreport) VALUES(?,?,?,?,?)',[m.networkMeasure.measure.value, m.networkMeasure.dataState,  id_unita_misura_rete, carrier[0].idgestore, report.insertId])
                }

                //take id tipo rete (voce o dati)
                var tipo_rete_voce = await pool.query('SELECT idtipo_rete FROM tipo_rete WHERE rete.descrizione="voce"')
                console.log(tipo_rete_voce)
                var tipo_rete_dati = await pool.query('SELECT idtipo_rete FROM tipo_rete WHERE rete.descrizione="dati"')
                console.log(tipo_rete_dati)

                //take id rete voce
                var rete_voce = await pool.query('SELECT idrete FROM rete WHERE rete.nome=?', m.networkMeasure.voiceNetwork.name)
                if(rete_voce == []){
                    var generazione = await pool.query('INSERT INTO generazione (nome) VALUES(?)', m.networkMeasure.voiceNetwork.generation)
                    rete_voce = await pool.query('INSERT INTO rete (nome, generazione_idgenerazione) VALUES(?,?)', m.networkMeasure.voiceNetwork.name, generazione.insertId)
                    //query misurazione rete has rete (voce)
                    var misurazione_has_rete = await pool.query('INSERT INTO misurazione_rete_cellulare_has_rete (misurazione_rete_cellulare_idmisurazione_rete_cellulare, rete_idrete, tipo_rete_idtipo_rete) VALUES(?,?,?)',[misurazione_rete[0].idmisurazione_rete_cellulare, rete_voce.insertId, tipo_rete_voce[0].idtipo_rete])
                }else{
                    var misurazione_has_rete = await pool.query('INSERT INTO misurazione_rete_cellulare_has_rete (misurazione_rete_cellulare_idmisurazione_rete_cellulare, rete_idrete, tipo_rete_idtipo_rete) VALUES(?,?,?)',[misurazione_rete[0].idmisurazione_rete_cellulare, rete_voce[0].idrete, tipo_rete_voce[0].idtipo_rete])
                }
                //take id rete dati
                var rete_dati = await pool.query('SELECT idrete FROM rete WHERE rete.nome=?', m.networkMeasure.dataNetwork.name)
                if(rete_dati == []){
                    var generazione = await pool.query('INSERT INTO generazione (nome) VALUES(?)', m.networkMeasure.dataNetwork.generation)
                    rete_dati = await pool.query('INSERT INTO rete (nome, generazione_idgenerazione) VALUES(?,?)', m.networkMeasure.dataNetwork.name, generazione.insertId)
                    //query misurazione rete has rete (dati)
                    var misurazione_has_rete = await pool.query('INSERT INTO misurazione_rete_cellulare_has_rete (misurazione_rete_cellulare_idmisurazione_rete_cellulare, rete_idrete, tipo_rete_idtipo_rete) VALUES(?,?,?)',[misurazione_rete[0].idmisurazione_rete_cellulare, rete_dati.insertId, tipo_rete_dati[0].idtipo_rete])
                }else{
                    var misurazione_has_rete = await pool.query('INSERT INTO misurazione_rete_cellulare_has_rete (misurazione_rete_cellulare_idmisurazione_rete_cellulare, rete_idrete, tipo_rete_idtipo_rete) VALUES(?,?,?)',[misurazione_rete[0].idmisurazione_rete_cellulare, rete_dati[0].idrete, tipo_rete_dati[0].idtipo_rete])
                }
            

            //query mis wifi
            var wifi = await pool.query('INSERT INTO misurazione_wifi (stato_antenna, report_idreport) VALUES(?,?)',[m.isWiFiEnabled, report.insertId])
            console.log(wifi)

            //query reti wifi
            for(let w of m.wifiMeasure){
                    //take id unit measure frequency 
                    var unit_measure_freq = await pool.query('SELECT idunita_misura FROM unita_misura WHERE unita_misura.nome=?', w.frequencyMeasure.unitMeasurement.name)
                    if(unit_measure_freq == []){
                        unit_measure_freq = await pool.query('INSERT INTO unita_misura (nome) VALUES(?)', w.frequencyMeasure.unitMeasurement.name)
                        var unita_misura_frequenza = unit_measure_freq.insertId
                    }
                    else{
                        var unita_misura_frequenza = unit_measure_freq[0].idunita_misura
                    }
                    //take id unit measure wifi 
                    var unit_measure_wifi = await pool.query('SELECT idunita_misura FROM unita_misura WHERE unita_misura.nome=?', w.dBmMeasure.unitMeasurement.name)
                    if(unit_measure_wifi == []){
                        unit_measure_wifi = await pool.query('INSERT INTO unita_misura (nome) VALUES(?)', w.dBmMeasure.unitMeasurement.name)
                        var unita_misura_wifi = unit_measure_wifi.insertId
                    }
                    else{
                        var unita_misura_wifi = unit_measure_wifi[0].idunita_misura
                    }
                    //insert frequency
                    var frequency = await pool.query('INSERT INTO frequenza (valore, canale, unita_misura_idunita_misura) VALUES(?,?,?)',[w.frequencyMeasure.value, w.channel, unita_misura_frequenza])
                    //insert rete 
                    var reti_wifi = await pool.query('INSERT INTO rete_wifi (SSID, valore, unita_misura_idunita_misura, frequenza_idfrequenza, misurazione_wifi_idmisurazione_wifi) VALUES(?,?,?,?,?)',[w.SSID, w.dBmMeasure.value, unita_misura_wifi, frequency.insertId, wifi.insertId])
                    console.log(reti_wifi)
            }
            }*/
            }catch{
            console.log("error")
            //  res.status(500).send();
            // throw new Error(err)
            }
    };


    


};