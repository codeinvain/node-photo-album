// load environment varialbes
var dotenv = require('dotenv');
dotenv.load();

var path = require('path');
// start express server
var express = require('express');
var engine  = require('ejs-locals');
var app = express(); 
app.set('views', path.normalize(__dirname)+ '/views/')
app.use(express.static(path.normalize(__dirname) + '/public'))

app.engine('ejs', engine);
app.set('view engine','ejs');

app.use(function (req, res, next) {
  if (typeof(process.env.CLOUDINARY_NAME)=='undefined' || typeof(process.env.CLOUDINARY_API_KEY)=='undefined' || 
      typeof(process.env.CLOUDINARY_API_SECRET)=='undefined' ){
    throw new Error('Missing .env file')
  }else{
    next()
  }
})

var demoController = require('./controllers/demo_controller');
demoController.wire(app);

app.use(function(err, req, res, next){
  if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
    return next()
  }
  if (~err.message.indexOf('.env')){
    res.status(500).render('errors/dotenv', { error: err})
  }else{
    res.status(500).render('errors/500', { error: err})
  }
})

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).render('errors/404', {
    url: req.originalUrl,
    error: 'Not found'
  })
})

var server = app.listen(process.env.PORT || 9000, function() {
    console.log('Listening on port %d', server.address().port);
});

