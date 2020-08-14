var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const cacheControl = require('express-cache-controller');
var stylus = require('stylus');
var hbs = require('express-handlebars');
var moment = require('helper-moment');
var _ = require('lodash');
var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');
var myEnv = dotenv.config();
const https = require("https");


dotenvExpand(myEnv)

var indexRouter = require('./routes/index');
const { all } = require('./routes/index');

var app = express();


// handlebars setup
app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ],
    helpers: require("./lib/helpers.js").helpers,
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Get settings from csv and set to app.set


// Configuración general: id-conf, valor
// Buscadores: tipo-buscador, id-elemento
// Estáticos home: id-elemento, valor
// Notas en perfiles: id-perfil, url-nota, titulo-nota, fecha-nota, medio, autor, explicacion-relacion

function appLocalsFromCSV(namespace,CSVurl) {
  app.locals[namespace] = {};

  https.get(CSVurl, response => {
    // var stream = response.pipe(file);
    response.on("data", function(data) {
      let csvlines = data.toString().split("\n");
      
      // console.log("appLocalsFromCSV data",CSVurl,data,csv);      
      for(line in csvlines) {
        //TODO: Parse quoted lines and multiple fields
        linearray = csvlines[line].split(",");
        if (linearray[0]) {
          app.locals[namespace][linearray[0].trim()] = linearray[1].trim();
        }
      }
      console.log("appLocalsFromCSV app locals",namespace, app.locals[namespace])
    });
  });
}


appLocalsFromCSV("general","https://share.mayfirst.org/s/z5p7CL9qxFJrgDD/download");
appLocalsFromCSV("buscadores","https://share.mayfirst.org/s/z5p7CL9qxFJrgDD/download");
appLocalsFromCSV("home","https://share.mayfirst.org/s/z5p7CL9qxFJrgDD/download");
appLocalsFromCSV("profile-links","https://share.mayfirst.org/s/z5p7CL9qxFJrgDD/download");
// console.log("app locals",app.locals)


app.use(cacheControl());

// log only 4xx and 5xx responses to console
app.use(morgan('short', {
  skip: function (req, res) { return (res.statusCode < 400 && (req.headers.accept && req.headers.accept.indexOf("html") == -1 )) }
}))


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use("/",
  express.static(
    path.join(__dirname, 'public'),
    {
      index:false,
      cacheControl: "no-cache",
    }
  )
);

// Bootstrap 4 and libraries
app.use('/jQuery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/tiza', express.static(__dirname + '/node_modules/tiza'));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.message = err.message;

  console.error("/!\\ QuienEsQuien.Wiki APP Error at URL: ",req.url);
  console.error("/!\\ QuienEsQuien.Wiki APP Error: ",err.message);

  res.cacheControl = {
    noStore: true
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error', { error: true });
});

module.exports = app;
