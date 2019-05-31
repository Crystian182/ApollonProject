const express         = require('express');
const bodyParser      = require('body-parser');
const app             = express();
const cors            = require('cors')

const MongoClient     = require('mongodb').MongoClient;
const url             = 'mongodb://localhost:27017/apollonproject'
const port            = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)

  require('./app/routes')(app, database.db("apollonproject"));
  require('./app/jobs/mongo_to_mysql_jobs')(database.db("apollonproject"));
  app.listen(port, () => {
    console.log('MongoDB live on port ' + port);
  });  
})


  