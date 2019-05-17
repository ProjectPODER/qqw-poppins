var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var hbs = require('express-handlebars');
var jquery = require('jquery');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


//This should vary according to environment
const API_DOMAIN = "http://localhost:10010";
const AUTOCOMPLETE_URL = API_DOMAIN+"/v1/autocomplete";
const FEED_URL = 'https://www.rindecuentas.org/feed/';

let config = {
  "API_DOMAIN": API_DOMAIN,
  "AUTOCOMPLETE_URL": AUTOCOMPLETE_URL,
  "FEED_URL": FEED_URL
}

app.set("config",config);


// handlebars setup
app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ],
    helpers: {
      api_domain: function() { return app.get("config").API_DOMAIN; },
      autocomplete_url: function() { return app.get("config").AUTOCOMPLETE_URL; }
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
