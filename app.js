const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cacheControl = require('express-cache-controller');
const stylus = require('stylus');
const hbs = require('express-handlebars');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config(); dotenvExpand(myEnv)
const indexRouter = require('./routes/index');
const lib = require("./lib/lib");
const app = express();
const helpers = require("./lib/helpers.js").helpers;


function initApp(appLocals) {
  // console.log("appLocals general",appLocals.general);
  // console.log("appLocals buscadores",appLocals.buscadores);
  // console.log("appLocals notas",appLocals.notas);

  
  // handlebars setup
    app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, appLocals.general.views[0].staging),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
        path.join(__dirname, appLocals.general.partials[0].staging),
    ],
    helpers: helpers,
  }));


  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');


  // log only 4xx and 5xx responses to console
  app.use(morgan('short', {
    skip: function (req, res) { return (res.statusCode < 400 && (req.headers.accept && req.headers.accept.indexOf("html") == -1 )) }
  }))

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  console.log("stylus path",appLocals.general.style_path[0].staging);
  app.use(stylus.middleware(
    {
      "serve": true,
      "dest": (appLocals.general.extra_static_path) ? path.join(__dirname, appLocals.general.extra_static_path[0].staging): "public", 
      "src": path.join(__dirname, appLocals.general.style_path[0].staging),
      "force": true,
      "linenos": false,
    }

  ));

  const staticOptions = {
    index:false,
    cacheControl: true,
    maxAge: 60000000
  };

  app.use("/", express.static(path.join(__dirname, 'public'), staticOptions));
  
  if (appLocals.general.extra_static_path) {
    app.use("/extra", express.static(path.join(__dirname, appLocals.general.extra_static_path[0].staging), staticOptions));
  }

  // Bootstrap 4 and libraries
  app.use('/jQuery', express.static(__dirname + '/node_modules/jquery/dist/',staticOptions));
  app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/',staticOptions));
  app.use('/tiza', express.static(__dirname + '/node_modules/tiza',staticOptions));
  app.use('/datatables', express.static(__dirname + '/node_modules/datatables.net/js',staticOptions));
  app.use('/datatables-styles', express.static(__dirname + '/node_modules/datatables.net-dt/css',staticOptions));
  


  app.use(cacheControl({
    // public: true,
    noCache: true
  }
  ));

  app.use('/', indexRouter);

  console.log("App started, server listening. Env",helpers.env());

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    //Don't show trace for 404 errors
    if (err.message!="Not Found") {
      // set locals, only providing error in development
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.locals.message = err.message;
  
      console.error("/!\\ QuienEsQuien.Wiki APP Error at URL: ",req.url);
      console.error("/!\\ QuienEsQuien.Wiki APP Error: ",err);
    }

    res.cacheControl = {
      noStore: true
    }
    // render the error page
    res.status(err.status || 500);
    res.render('error', { error: true, current_url: req.url });
  });

  //Last resource error handler.
  app.use(function(err, req, res, next) {
    res.status(404);
    res.json({
      en: "We will recover from this too. Please reload the page. If this message repeats, please let us know.",
      es: "Nos vamos a recuperar de esta. Por favor refresque la página. Si este mensaje se repite por favor infórmenos."
    });
  });
}


lib.loadSettings(app,initApp);


module.exports = app;
