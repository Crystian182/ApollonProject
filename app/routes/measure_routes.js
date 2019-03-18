module.exports = function(app, db) {

    var ObjectID = require('mongodb').ObjectID;

    app.get('/measures/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('measures').findOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send(item);
          } 
        });
      });

    app.post('/measures', (req, res) => {
        const measure = { text: req.body.text, title: req.body.title };
        db.collection('measures').insert(measure, (err, result) => {
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
        db.collection('measures').remove(details, (err, item) => {
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
        const note = { text: req.body.text, title: req.body.title };
        db.collection('measures').update(details, note, (err, result) => {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              res.send(note);
          } 
        });
      });
  };