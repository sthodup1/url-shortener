var express = require("express");
var mongo = require("mongodb").MongoClient;
var index = require('./app/index.js');
var api = require("./app/api.js");
var app = express();

var url = process.env.MONGOLAB_URI;      

// Use connect method to connect to the Server
mongo.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
        
    } else {
        console.log('Connection established to', url);
        // do some work here with the database.
        //Close connection
        
        app.set('env', 'production');
        app.set('views', __dirname);
        app.set('view engine', 'pug');
        
        index(app);
        api(app, db);
        
        app.listen(process.env.PORT || 8080, function () {
            console.log('App is listening');
        });
        
        
       // var sitesCollection = db.collection('websites');
       // sitesCollection.insert({original : "https://www.google.com", short : 1}, function(err, data) {
       //     if(err) {
        //        throw err;
       //     }
       //     console.log(data);
      //      db.close();
      //  })
      //  db.close();
        
    }
});