var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var hbs = require('express-handlebars');
var jquery = require('jquery');
var moment = require('helper-moment');
var _ = require('lodash')
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')
var myEnv = dotenv.config()
dotenvExpand(myEnv)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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
    // helpers: require("./public/javascripts/helpers.js").helpers
    helpers: {
      api_domain: function() { return process.env.API_DOMAIN; },
      autocomplete_url: function() { return process.env.AUTOCOMPLETE_URL; },
      moment: function(date) {
        if (date) {
          moment_helper = require('helper-moment');
          return moment_helper(date);
        }
        return "Fecha desconocida";
      },
      format_amount: function(value) {
        if (value) {
          return "$"+value.toLocaleString('es-MX',
            {
              style: 'decimal',
              maximumFractionDigits: 2
            });
        }
        return 'Importe desconocido';
      },
      format_currency: function(value) {
        if (value == "MXN") {
          return "Pesos mexicanos"
        }
        else if (value == "USD") {
          return "Dólares estadounidenses"
        }
        else if (value == "EUR") {
          return "Euros"
        }
        return value;
      },
      limit: function (arr, limit) {
        if (!Array.isArray(arr)) {
          return []; }
        return arr.slice(0, limit);
      },
      'var': function(name, value, context){
        this[name] = value;
      },
      math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
      },
      ifCond: function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
      },
      format_number: function(value) {
        if (value) {
          return value.toLocaleString('es-MX');
        }
        return 'Valor desconocido';
      },
      get_party_type: function(records,party_id) {
        let party;
        if (records) {
          party = _.find(records[0].compiledRelease.parties,party_id);
          if (!party) {
            party = _.find(records[0].compiledRelease.parties,(party_id,i,parties) => { if (parties[i].memberOf) { return parties[i].memberOf.id == party_id } })
          }
          if (party && party.details) {
            return party.details.type;
          }
          else {
            console.log("get_party_type not found",party_id,records[0].compiledRelease.parties);
            return "unknown";
          }
        }
        else {
          console.log("get_party_type no record",party_id);
          return "unknown";

        }
      }
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
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.message = err.message;

  console.error("/!\\ QuienEsQuien.Wiki APP Error",err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
