// Used a module to learn how to use modules in my apps
module.exports = function(app) {
    app.get('/', function(req, res) {
         res.render('index');
    });
    
};