module.exports = function(app, mongodb) {

  var ObjectID = require('mongodb').ObjectID;
  var pool = require('../../config/mysqldb')

  const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

  /*app.get('/misurazioni', asyncMiddleware(async (req, res, next) => {
      try {
        misurazioniRes = [];
        const misurazioni = await mongodb.collection('misurazioni').find().toArray();
        for(i=0; i<misurazioni.length; i++) {
          const details = { '_id': new ObjectID(misurazioni[i].idcentralina) };
          const centralina = await mongodb.collection('centraline').findOne(details)
          var misurazione = {_id: misurazioni[i]._id,
                            valore: misurazioni[i].valore,
                            data: misurazioni[i].data,
                            centralina: centralina}
          misurazioniRes.push(misurazione)
        }
        res.send(misurazioniRes);
      } catch (err) {
        res.status(500).send();
        throw new Error(err)
      }
    })
  );*/

  /*app.post('/misurazioni', asyncMiddleware(async (req, res, next) => {
      const misurazione = {
        valore: req.body.valore,
        data: new Date(),
        idcentralina: req.body.centralina._id
      };
      try {
        const result = await mongodb.collection('misurazioni').insert(misurazione);
        res.send(result)
      } catch(err) {
        res.status(500).send();
        throw new Error(err)
      }
    })
  );*/

  
  /*const cron = require('node-cron');
  var task =  cron.schedule('* * * * *',  () => {
    runTask();
  });
  task.start();*/
 
  app.get('/misurazioni/media/zoom=:zoom&lat1=:lat1&lat2=:lat2&long1=:long1&long2=:long2', async function (req, res) {
    try {
      var misurazioni = await pool.query('SELECT latitudine, longitudine, weight FROM media_zoom' + req.params.zoom + ' WHERE' +
              ' latitudine>=' + req.params.lat2 + ' AND latitudine<=' + req.params.lat1 + ' AND longitudine>=' + req.params.long1 + ' AND longitudine<=' + req.params.long2);
      res.send(misurazioni);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/getyears', async function (req, res) {
    try {
      var anni = await pool.query('SELECT data AS anno FROM media_anno_zoom1;');
      res.send(anni);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/getmonthofyear/:year', async function (req, res) {
    try {
      var mesi = await pool.query('SELECT SUBSTRING(data, 6, 8) AS mese FROM media_mese_zoom1 WHERE SUBSTRING(data, 1, 4) = ' + req.params.year + ';');
      res.send(mesi);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/getdayofmonth/year=:year&month=:month', async function (req, res) {
    try {
      var giorni = await pool.query('SELECT SUBSTRING(data, 9, 10) AS giorno FROM media_giorno_zoom1 WHERE SUBSTRING(data, 1, 7) = \'' + req.params.year + '-' + req.params.month + '\';');
      res.send(giorni);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/gethourofday/year=:year&month=:month&day=:day', async function (req, res) {
    try {
      var ore = await pool.query('SELECT SUBSTRING(data, 12) AS ora FROM media_ora_zoom1 WHERE SUBSTRING(data, 1, 10) = \'' + req.params.year + '-' + req.params.month + '-' + req.params.day + '\';');
      res.send(ore);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/media/anno/from=:start&to=:end&zoom=:zoom&lat1=:lat1&lat2=:lat2&long1=:long1&long2=:long2', async function (req, res) {
    try {
      var arr = await pool.query('SELECT latitudine, longitudine, weight, data FROM media_anno_zoom' + req.params.zoom + ' WHERE' +
              ' latitudine>=' + req.params.lat2 + ' AND latitudine<=' + req.params.lat1 + ' AND longitudine>=' + req.params.long1 + ' AND longitudine<=' + req.params.long2 + ' AND ' +
              'STR_TO_DATE(data, \'%Y\')>=STR_TO_DATE(\'' + req.params.start + '\', \'%Y\') AND STR_TO_DATE(data, \'%Y\')<=STR_TO_DATE(\'' + req.params.end + '\', \'%Y\')');
      var sorted = {};
      for( var i = 0, max = arr.length; i < max ; i++ ){
        if( sorted[arr[i].data] == undefined ){
          sorted[arr[i].data] = [];
        }
        sorted[arr[i].data].push(arr[i]);
      }
      res.send(sorted);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/media/mese/from=:start&to=:end&zoom=:zoom&lat1=:lat1&lat2=:lat2&long1=:long1&long2=:long2', async function (req, res) {
    try {
      var arr = await pool.query('SELECT latitudine, longitudine, weight, data FROM media_mese_zoom' + req.params.zoom + ' WHERE' +
              ' latitudine>=' + req.params.lat2 + ' AND latitudine<=' + req.params.lat1 + ' AND longitudine>=' + req.params.long1 + ' AND longitudine<=' + req.params.long2 + ' AND ' +
              'STR_TO_DATE(data, \'%Y-%m\')>=STR_TO_DATE(\'' + req.params.start + '\', \'%Y-%m\') AND STR_TO_DATE(data, \'%Y-%m\')<=STR_TO_DATE(\'' + req.params.end + '\', \'%Y-%m\')');
      var sorted = {};
      for( var i = 0, max = arr.length; i < max ; i++ ){
        if( sorted[arr[i].data] == undefined ){
          sorted[arr[i].data] = [];
        }
        sorted[arr[i].data].push(arr[i]);
      }
      res.send(sorted);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/media/giorno/from=:start&to=:end&zoom=:zoom&lat1=:lat1&lat2=:lat2&long1=:long1&long2=:long2', async function (req, res) {
    try {
      var arr = await pool.query('SELECT latitudine, longitudine, weight, data FROM media_giorno_zoom' + req.params.zoom + ' WHERE' +
              ' latitudine>=' + req.params.lat2 + ' AND latitudine<=' + req.params.lat1 + ' AND longitudine>=' + req.params.long1 + ' AND longitudine<=' + req.params.long2 + ' AND ' +
              'STR_TO_DATE(data, \'%Y-%m-%d\')>=STR_TO_DATE(\'' + req.params.start + '\', \'%Y-%m-%d\') AND STR_TO_DATE(data, \'%Y-%m-%d\')<=STR_TO_DATE(\'' + req.params.end + '\', \'%Y-%m-%d\')');
      var sorted = {};
      for( var i = 0, max = arr.length; i < max ; i++ ){
        if( sorted[arr[i].data] == undefined ){
          sorted[arr[i].data] = [];
        }
        sorted[arr[i].data].push(arr[i]);
      }
      res.send(sorted);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni/media/ora/from=:start&to=:end&zoom=:zoom&lat1=:lat1&lat2=:lat2&long1=:long1&long2=:long2', async function (req, res) {
    try {
      var arr = await pool.query('SELECT latitudine, longitudine, weight, data FROM media_ora_zoom' + req.params.zoom + ' WHERE' +
              ' latitudine>=' + req.params.lat2 + ' AND latitudine<=' + req.params.lat1 + ' AND longitudine>=' + req.params.long1 + ' AND longitudine<=' + req.params.long2 + ' AND ' +
              'STR_TO_DATE(data, \'%Y-%m-%d %H:%i:%s\')>=STR_TO_DATE(\'' + req.params.start + '\', \'%Y-%m-%d %H:%i:%s\') AND STR_TO_DATE(data, \'%Y-%m-%d %H:%i:%s\')<=STR_TO_DATE(\'' + req.params.end + '\', \'%Y-%m-%d %H:%i:%s\')');
      var sorted = {};
      for( var i = 0, max = arr.length; i < max ; i++ ){
        if( sorted[arr[i].data] == undefined ){
          sorted[arr[i].data] = [];
        }
        sorted[arr[i].data].push(arr[i]);
      }
      res.send(sorted);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  });

  app.get('/misurazioni', asyncMiddleware(async (req, res, next) => {
    try {
      var networkMeasure = [];
      const misurazioni = await mongodb.collection('misurazioni').find().toArray();
      for(let m of misurazioni) {
        networkMeasure.push({
          lat: m.gpsMeasure.lat.value,
          lng: m.gpsMeasure.lng.value,
          weight: getWeight(m.networkMeasure.measure.value)
        })
      }
      res.send(networkMeasure);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
  })
);

app.get('/misurazioni/efmedium', asyncMiddleware(async (req, res, next) => {
  try {
    var low =  await pool.query('SELECT (COUNT(result.media)*100)/(SELECT COUNT(DISTINCT(smartphone_idsmartphone)) FROM report) AS percentage FROM (SELECT AVG(misurazione_campo_magnetico.valore) AS \'media\' FROM misurazione_campo_magnetico, report WHERE misurazione_campo_magnetico.report_idreport = report.idreport GROUP BY report.smartphone_idsmartphone) AS result WHERE result.media <= \'30\'')
    var med =  await pool.query('SELECT (COUNT(result.media)*100)/(SELECT COUNT(DISTINCT(smartphone_idsmartphone)) FROM report) AS percentage  FROM (SELECT AVG(misurazione_campo_magnetico.valore) AS \'media\' FROM misurazione_campo_magnetico, report WHERE misurazione_campo_magnetico.report_idreport = report.idreport GROUP BY report.smartphone_idsmartphone) AS result WHERE result.media>\'30\' AND result.media<=\'60\'')
    var high =  await pool.query('SELECT (COUNT(result.media)*100)/(SELECT COUNT(DISTINCT(smartphone_idsmartphone)) FROM report) AS percentage  FROM (SELECT AVG(misurazione_campo_magnetico.valore) AS \'media\' FROM misurazione_campo_magnetico, report WHERE misurazione_campo_magnetico.report_idreport = report.idreport GROUP BY report.smartphone_idsmartphone) AS result WHERE result.media > \'60\'')

    res.send([{label: 'Basso', percentage: low[0].percentage},
              {label: 'Medio', percentage: med[0].percentage},
              {label: 'Alto', percentage: high[0].percentage}]);
  } catch (err) {
    res.status(500).send();
    throw new Error(err)
  }
}));

app.get('/misurazioni/daychanges', asyncMiddleware(async (req, res, next) => {
  try {
    //var measures = await mongodb.collection('misurazioni').find({$and: [{$or: [{"gpsMeasure.lat.value": {$gt: 40.357037-0.02}},{"gpsMeasure.lat.value": {$lt: 40.357037+0.02}}]},{$or: [{"gpsMeasure.lng.value": {$gt: 18.171848-0.02}},{"gpsMeasure.lng.value": {$lt: 18.171848+0.02}}]}]}).toArray()

    res.send([
              {hour: 1, level: -111},
              {hour: 2, level: -112},
              {hour: 3, level: -113},
              {hour: 4, level: -114},
              {hour: 5, level: -115},
              {hour: 6, level: -116},
              {hour: 7, level: -100},
              {hour: 8, level: -95},
              {hour: 9, level: -97},
              {hour: 10, level: -98},
              {hour: 11, level: -94},
              {hour: 12, level: -90},
              {hour: 13, level: -93},
              {hour: 14, level: -87},
              {hour: 15, level: -80},
              {hour: 16, level: -85},
              {hour: 17, level: -90},
              {hour: 18, level: -82},
              {hour: 19, level: -75},
              {hour: 20, level: -90},
              {hour: 21, level: -95},
              {hour: 22, level: -100},
              {hour: 23, level: -112}
    ]);
  } catch (err) {
    res.status(500).send();
    throw new Error(err)
  }
}));

app.get('/misurazioni/carriermedium', asyncMiddleware(async (req, res, next) => {
  try {
    //var medium = await mongodb.collection('misurazioni').aggregate([{$group:{_id: "$simInfo.carrier", avgdbm: { $avg: "$networkMeasure.measure.value" }}}]).toArray()
    var medium = await pool.query('SELECT AVG(misurazione_rete_cellulare.valore) AS \'avgdbm\', gestore.nome AS \'_id\'FROM misurazione_rete_cellulare, gestore WHERE misurazione_rete_cellulare.gestore_idgestore = gestore.idgestore GROUP BY misurazione_rete_cellulare.gestore_idgestore;')
    res.send(medium);
  } catch (err) {
    res.status(500).send();
    throw new Error(err)
  }
})
);

function getWeight(value) {
  if(value <= -110)
    return 0.15;
  else if(-110 < value && value <= -100)
    return 0.30;
  else if(-100 < value && value <= -91)
    return 0.55;
  else if(-91 < value && value <= -76)
    return 0.70;
  else if(-76 < value && value <= -60)
    return 0.85;
  else if(value < -60)
    return 1;
}

  app.post('/misurazioni', asyncMiddleware(async (req, res, next) => {
    try {
      var timestampReport = new Date(req.body.timestamp)
      var timestampGPS = new Date(req.body.gpsMeasure.timestamp)
      var userTimezoneOffset = timestampReport.getTimezoneOffset() * 60000;

      req.body.timestamp = new Date(timestampReport.getTime() - userTimezoneOffset);
      req.body.gpsMeasure.timestamp = new Date(timestampGPS.getTime() - userTimezoneOffset);

      const result = await mongodb.collection('misurazioni').insert(req.body);
      res.send(result)
    } catch(err) {
      res.status(500).send();
      throw new Error(err)
    }
  })
);

  app.delete('/misurazioni/:id', asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    try {
      const result = await mongodb.collection('misurazioni').remove(details);
      res.send().status(200);
    } catch (err) {
      res.status(500).send();
      throw new Error(err)
    }
    })
  );

  app.put('/misurazioni', asyncMiddleware(async (req, res, next) => {
      const misurazione = {
        valore: req.body.valore,
        idcentralina: req.body.centralina._id
      };
      const details = { '_id': new ObjectID(req.body._id) };
      try {
        const result = await mongodb.collection('misurazioni').update(details, { $set: misurazione})
        res.send(result)
      } catch(err) {
        res.status(500).send();
        throw new Error(err)
      }
    })
  );
};