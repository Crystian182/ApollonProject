module.exports = function(app, mongodb) {

  var pool = require('../../config/mysqldb')

  const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
 
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
      var mesi = await pool.query('SELECT SUBSTRING(data, 6, 8) AS mese FROM media_mese_zoom1 WHERE SUBSTRING(data, 1, 4) = ' + req.params.year + '  ORDER BY mese ASC;');
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

  app.get('/misurazioni/averageDB', asyncMiddleware(async (req, res, next) => {
    try {
      var low =  await pool.query('SELECT (COUNT(result.media)*100)/(SELECT COUNT(DISTINCT(smartphone_idsmartphone)) FROM report) AS percentage FROM (SELECT AVG(misurazione_rete_cellulare.valore) AS \'media\' FROM misurazione_rete_cellulare, report WHERE misurazione_rete_cellulare.report_idreport = report.idreport GROUP BY report.smartphone_idsmartphone) AS result WHERE result.media <= \'-110\'')
      var med =  await pool.query('SELECT (COUNT(result.media)*100)/(SELECT COUNT(DISTINCT(smartphone_idsmartphone)) FROM report) AS percentage  FROM (SELECT AVG(misurazione_rete_cellulare.valore) AS \'media\' FROM misurazione_rete_cellulare, report WHERE misurazione_rete_cellulare.report_idreport = report.idreport GROUP BY report.smartphone_idsmartphone) AS result WHERE result.media>\'-110\' AND result.media<=\'-100\'')
      var high =  await pool.query('SELECT (COUNT(result.media)*100)/(SELECT COUNT(DISTINCT(smartphone_idsmartphone)) FROM report) AS percentage  FROM (SELECT AVG(misurazione_rete_cellulare.valore) AS \'media\' FROM misurazione_rete_cellulare, report WHERE misurazione_rete_cellulare.report_idreport = report.idreport GROUP BY report.smartphone_idsmartphone) AS result WHERE result.media > \'-100\'')

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
    daychanges = [];
    for(let i=1; i<24; i++) {
        var dayaverage = await pool.query('SELECT AVG(media) AS media FROM media_ora_zoom1 WHERE data = DATE_FORMAT(data, \'%Y-%m-%d ' + i + ':00:00\');');
        if(dayaverage[0].media != null) {
          daychanges.push({hour: i, level: dayaverage[0].media})
        }
    }
    res.send(daychanges)
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

};