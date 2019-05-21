module.exports = function(app, mongodb) {

  var ObjectID = require('mongodb').ObjectID;

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
})
);

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