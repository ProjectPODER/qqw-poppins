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


function initApp(appLocals) {
  // console.log("appLocals general",appLocals.general);
  // console.log("appLocals buscadores",appLocals.buscadores);
  // console.log("appLocals notas",appLocals.notas);

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
  app.use('/datatables', express.static(__dirname + '/node_modules/datatables.net/js'));
  app.use('/datatables-styles', express.static(__dirname + '/node_modules/datatables.net-dt/css'));
  
  app.use('/', indexRouter);

  console.log("App started, server listening");

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
    res.render('error', { error: true, current_url: req.url });
  });

  //Last resource error handler.
  app.use(function(err, req, res, next) {
    res.status(500);
    res.json({
      en: "We will recover from this too. Please reload the page. If this message repeats, please let us know.",
      es: "Nos vamos a recuperar de esta. Por favor refresque la página. Si este mensaje se repite por favor infórmenos."
    });
  });
}


lib.loadSettings(app,initApp);


module.exports = app;
