module.exports = function(app, mongodb) {

  var ObjectID = require('mongodb').ObjectID;

  const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

  app.get('/misurazioni', asyncMiddleware(async (req, res, next) => {
    misurazioniRes = [];
    const misurazioni = await mongodb.collection('misurazioni').find().toArray();
    for(i=0; i<misurazioni.length; i++) {
      const details = { '_id': new ObjectID(misurazioni[i].idcentralina) };
      const centralina = await mongodb.collection('centraline').findOne(details)
      var misurazione = {id: misurazioni[i]._id,
                        valore: misurazioni[i].valore,
                        data: misurazioni[i].data,
                        centralina: centralina}
      misurazioniRes.push(misurazione)
    }
    res.json(misurazioniRes);
    }));

  app.post('/misurazioni', asyncMiddleware(async (req, res, next) => {
    const misurazione = {
      valore: req.body.valore,
      data: new Date(),
      idcentralina: req.body.centralina._id
    };
    try {
      const result = await mongodb.collection('misurazioni').insert(misurazione);
      res.send(result)
    } catch(err) {
      res.send(err)
    }
  }));

  app.delete('/misurazioni/:id', asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    try {
      const result = await mongodb.collection('misurazioni').remove(details);
      res.send().status(200);
    } catch (err) {
      res.send(err)
    }
    }))
  

  app.put('/misurazioni', asyncMiddleware(async (req, res, next) => {
    const misurazione = {
      valore: req.body.valore,
      idcentralina: req.body.centralina._id
    };
    const details = { '_id': new ObjectID(req.body.id) };
    try {
      const result = await mongodb.collection('misurazioni').update(details, { $set: misurazione})
      res.send(result)
    } catch(err) {
      res.send(err)
    }
  }));

};