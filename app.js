"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var _ = require('underscore');

var mall = require('./routes/index');
var student = require('./routes/student');
var store = require('./routes/store');
var admin = require('./routes/admin');

var app = express();

// mongoose
var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/xiaotao';
mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static('./bower_components'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'xiaotao',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./assets'));

app.locals.moment = require('moment');
app.locals.pretty = true;

app.use(function(req, res, next) {
  app.locals.nowstu = req.session.student;
  app.locals.nowstore = req.session.store;
  next();
});

app.use('/', mall);
app.use('/student', student);
app.use('/store', store);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.get("*",function(req, res, next) {
  res.render('./error/404', {
    title: 'No Found'
  });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('./error/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('./error/error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
