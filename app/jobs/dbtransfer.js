const cron            = require("node-cron");

module.exports = {

    processDataFromMongo: function(app, mongodb) {
        
        /*var task = cron.schedule("* * * * *", async function() {
            console.log("running a task every minute " + new Date());
            const misurazioni = await mongodb.collection('misurazioni').find().toArray();
            console.log(misurazioni[0])
          });
    
        task.start()*/
    }

};