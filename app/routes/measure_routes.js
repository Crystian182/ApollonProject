module.exports = function(app, mongodb) {

    var ObjectID = require('mongodb').ObjectID;

    app.get('/measures/:id', (req, res) => {
      const id = req.params.id;
      const details = { '_id': new ObjectID(id) };
      mongodb.collection('measures').findOne(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(item);
        } 
      });
    });

    app.get('/measures', (req, res) => {
      mongodb.collection('measures').find({}).toArray(function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(JSON.stringify(result));
        }
      })
    });

    app.post('/measures', (req, res) => {
      const measure = new ObjectModel({
        value: req.body.value,
        lat: req.body.lat,
        lng: req.body.lng,
        date: new Date()
      });
    /*  db.collection('measures').insert(measure, (err, result) => {
      };*/
      mongodb.collection('measures').insert(measure, (err, result) => {
        if (err) { 
          res.send({ 'error': 'An error has occurred' }); 
        } else {
          res.send(result.ops[0]);
        }
      });
    });

    app.delete('/measures/:id', (req, res) => {
      const id = req.params.id;
      const details = { '_id': new ObjectID(id) };
      mongodb.collection('measures').remove(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send('Measure ' + id + ' deleted!');
        } 
      });
    });

    app.put('/measures/:id', (req, res) => {
      const id = req.params.id;
      const details = { '_id': new ObjectID(id) };
      const measure = {
        value: req.body.value,
        lat: req.body.lat,
        lng: req.body.lng,
        date: new Date()
      };
      mongodb.collection('measures').update(details, measure, (err, result) => {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            res.send(note);
        } 
      });
    });

  };