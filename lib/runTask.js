module.exports = async function runTask(){
    console.log("running task")
    try{
      const misurazioni = await mongodb.collection('misurazioni').find().toArray();
     // var result = await pool.query('CREATE TABLE IF NOT EXISTS report (id varchar(80) NOT NULL PRIMARY KEY)')
     // var model = await pool.query('SELECT idmodello FROM modello WHERE imei = ?', m.phoneInfo.model)
      
      var result2 = 'INSERT IGNORE INTO report (idreport, data_report, data_ricezione, smartphone_idsmartphone) VALUES(?,?,?,?)'
      for(let m of misurazioni) {
        var smart = await pool.query('SELECT idsmartphone FROM smartphone WHERE smartphone.imei=?', m.phoneInfo.imei)
        //console.log(smart)
        var values = [String(m._id), new Date().toLocaleString(), new Date().toLocaleString(), smart]
        pool.query(result2, values, (err, results, fields) => {
          if (err) {
            return console.error(err.message);
          }
        console.log(results)
        });
    }
    }catch{
      console.log("error")
    //  res.status(500).send();
    // throw new Error(err)
    }
};
