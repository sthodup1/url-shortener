// Handles the actual api portions of the project

module.exports = function(app, db) {
    app.get('/new/*', function (req, res) {
  //.send(req.params.date);
     var original = req.url.slice(5);
      //res.send(isValidURL(original).toString());
      var toSend = {};
      if(isValidURL(original)) {
         var collection = db.collection('websites');
         
         // Keeps track of total number of shortened links created
         var totalCount;
         collection.count({}, function(err, count){
           if(err) {
             throw err;
           }
           totalCount = count;
         });
         
         // Check if url is in db already
         collection.count({original : original}, function(err, count){
            if(err) {
              throw err;
            }
            // Add url to db if not there
            if(count == 0) {
              console.log(totalCount);
              var toInsert = {original : original, short : (totalCount + 1).toString()};
              collection.insert(toInsert, function(err) {
                if(err) {
                  throw err;
                }
                toSend = {
                  original : toInsert.original,
                  short : "https://api-projects-sthodupunuri.c9users.io/" + toInsert.short
                };
                res.json(toSend);
              });
            }
            // Use a previously generated short link
            else {
              collection.find({original : original}).toArray(function(err, docs) {
                if(err) {
                  throw err;
                }
                toSend = {
                  original : docs[0].original, 
                  short : "https://api-projects-sthodupunuri.c9users.io/" + docs[0].short};
                  res.json(toSend);
              });
              
            }

           // db.close();
         });
     } else {
       toSend = { error : "This is not a valid URL" };
       res.json(toSend);
     }
    });
    
    
    app.get("/*", function(req, res) {
      // Check if request is in db
      var short = req.url.slice(1);
      if(isNaN(short)) {
        return res.status(404).send("URL doesn't exist");
      }
        
      var collection = db.collection("websites");
      collection.find({short : short}).toArray(function(err, docs) {
        if(err) {
          throw err;
        }
        if(docs.length == 0) {
          return res.status(404).send("URL doesn't exist");
        }
        
        return res.redirect(docs[0].original);

      })
    });
};

    

function isValidURL(url) {
  //  return /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url);

    //Regex from https://github.com/jzaefferer/jquery-validation

    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
    
}