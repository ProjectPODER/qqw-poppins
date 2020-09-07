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
var csv = require('@vanillaes/csv');

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

// Get settings from csv and set to app.locals.
// Parameters:
// - namespace: string, representing the name of the property used to store the values of this CSV file
// - CSVurl: URL from which to retrieve the CSV file
// - fields: array with column names for the CSV, each line in the CSV will be an object in an array of values. First field is the index.
function appLocalsFromCSV(namespace,CSVurl,fields) {
  if (!CSVurl) {
    console.error("appLocalsFromCSV error: Missing CSVurl for namespace",namespace);
    return false;
  }

  //Creat the namespace object
  app.locals[namespace] = {};

  //Perform request
  https.get(CSVurl, response => {
    // var stream = response.pipe(file);
    response.on("data", function(data) {
      parsedCSV = csv.parse(data);

      // console.log("appLocalsFromCSV data",CSVurl,data,csv);      
      for(line in parsedCSV) {
        //Only parse lines with a first value present, and ignore the first one
        if (line > 0 && parsedCSV[line][0]) {

          //Create values object for this line
          const values = {}

          //Iterate each field
          for (f in fields) {
            // console.log(f,fields,linearray);
            //Only parse existent values
            if (parsedCSV[line][f]) {
              //First field is the id
              if (f==0) {
                id = parsedCSV[line][f];
              }
              //All other fields are part of the values object
              else {
                values[fields[f]] = parsedCSV[line][f];
              }
            }
            else {
              console.error("appLocalsFromCSV","Field '",f,fields[f],"' not present in CSV line",line,"when loading",namespace,"from",CSVurl);
            }
          }
          //Add the values object to the array for this id 
          if (!app.locals[namespace][id]) { app.locals[namespace][id] = [] }
          app.locals[namespace][id].push(values);
        }
      }
      // console.log("appLocalsFromCSV app locals",namespace, app.locals[namespace])
      console.log("Loaded config")
    });
  });
}


// Configuración general: id-conf, valor
// Buscadores: tipo-buscador, id-elemento
// Estáticos home: id-elemento, valor
// Notas en perfiles: id-perfil, url-nota, titulo-nota, fecha-nota, medio, autor, explicacion-relacion
appLocalsFromCSV("general",process.env.CSVSETTINGS_GENERAL_URL,["id","es","en"]);
appLocalsFromCSV("buscadores",process.env.CSVSETTINGS_BUSCADORES_URL,["tipo-buscador","id"]);
appLocalsFromCSV("notas",process.env.CSVSETTINGS_NOTAS_URL,["id","url","titulo","fecha","medio","autor","explicacion_es","explicacion_en"]);
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
  console.error("/!\\ QuienEsQuien.Wiki APP Error: ",err);

  res.cacheControl = {
    noStore: true
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error', { error: true });
});

//Last resource error handler.
app.use(function(err, req, res, next) {
  res.status(500);
  res.json({
    en: "We will recover from this too. Please reload the page. If this message repeats, please let us know.",
    es: "Nos vamos a recuperar de esta. Por favor refresque la página. Si este mensaje se repite por favor infórmenos."
  });
});


module.exports = app;
