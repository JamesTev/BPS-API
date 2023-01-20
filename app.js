'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //set path for static file serving

app.use(cors())

app.use('/', indexRouter);

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
  next()
});

//configure server to allow cross-origin requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = app;
