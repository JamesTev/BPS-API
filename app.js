'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser')
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var dbPool = require('./db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); //tell the engine where views are stored
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //set path for static file serving

app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//configure server to allow cross-origin requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var authCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-x554m04n.eu.auth0.com/.well-known/jwks.json'
}),
audience: 'http://bps.co.za',
issuer: 'https://dev-x554m04n.eu.auth0.com/',
algorithms: ['RS256']
});

app.use(authCheck);
// Set the headers for number plate request
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/json'
}

//connect to DB using connection instance
var testQuery = function(){
  dbPool.query("SELECT 1", function (err, result, fields) {
    if (err){
      console.log("Could not connect to DB")
      throw err
    }
    console.log("Test query succeeded. DB connected")
  });
}

testQuery()

module.exports = app;
