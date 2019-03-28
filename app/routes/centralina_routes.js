module.exports = function(app, mongodb) {

  var ObjectID = require('mongodb').ObjectID;

  const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

  app.get('/centraline', asyncMiddleware(async (req, res, next) => {
      try {
        const result = await mongodb.collection('centraline').find().toArray();
        res.send(result)
      } catch (err) {
        res.status(500).send();
        throw new Error(err)
      }
    })
  );

  app.post('/centraline', asyncMiddleware(async (req, res, next) => {
      const centralina = {
        nome: req.body.nome,
        lat: req.body.lat,
        lng: req.body.lng
      };
      try {
        const result = await mongodb.collection('centraline').insert(centralina);
        res.send(result.ops[0]);
      } catch(err) {
        res.status(500).send();
        throw new Error(err)
      }
    })
  );

  app.delete('/centraline/:id',  asyncMiddleware(async (req, res, next) => {
      const id = req.params.id;
      const details = { '_id': new ObjectID(id) };
      try {
        const deleteAllMis = await mongodb.collection('misurazioni').remove({ 'idcentralina': id })
        const result = await mongodb.collection('centraline').remove(details)
        res.send().status(200)
      } catch (err) {
        res.status(500).send();
        throw new Error(err)
      }
    })
  );

  app.put('/centraline', asyncMiddleware(async (req, res, next)  => {
      const details = { '_id': new ObjectID(req.body._id) };
      const centralina = {
        nome: req.body.nome,
        lat: req.body.lat,
        lng: req.body.lng
      };
      try {
        const result = await mongodb.collection('centraline').update(details, centralina);
        res.send(result)
      } catch(err) {
        res.status(500).send();
          throw new Error(err)
      }
    })
  );

};