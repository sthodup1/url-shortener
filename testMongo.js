var mongo = require("mongodb").MongoClient;


// Connection URL. This is where your mongodb server is running.

//(Focus on This Variable)
var url = process.env.MONGOLAB_URI;      
//(Focus on This Variable)

// Use connect method to connect to the Server
mongo.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
        
    } else {
        console.log('Connection established to', url);
        // do some work here with the database.
        //Close connection
        db.close();
        
    }
});