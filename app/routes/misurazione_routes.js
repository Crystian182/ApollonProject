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
 
  app.get('/misurazioni/media', async function (req, res) {
    try {
      var misurazioni = await pool.query('SELECT latitudine, longitudine, weight FROM media_zoom4');
      res.send(misurazioni);
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
    var medium = await mongodb.collection('misurazioni').aggregate([{$group:{_id: "$phoneInfo.imei",avgEM: { $avg: "$emMeasure.value" }}}]).toArray()
    var totalUsers = medium.length
    var low = 0; //<=43
    var med = 0; //>43 e <=46
    var high = 0; //>46

    for(let m of medium) {
      if(m.avgEM <= 43) {
        low = low + 1
      } else if(m.avgEM > 43 && m.avgEM <= 46) {
        med = med + 1
      } else if(m.avgEM > 46) {
        high = high + 1
      }
    }
    
    //low:total=x:100
    var percLow = (low*100)/totalUsers
    var percMed = (med*100)/totalUsers
    var percHigh = (high*100)/totalUsers

    res.send([{label: 'Basso', percentage: percLow},
              {label: 'Medio', percentage: percMed},
              {label: 'Alto', percentage: percHigh}]);
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
    var medium = await mongodb.collection('misurazioni').aggregate([{$group:{_id: "$simInfo.carrier", avgdbm: { $avg: "$networkMeasure.measure.value" }}}]).toArray()
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