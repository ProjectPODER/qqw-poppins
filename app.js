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
const util = require('util');

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
      moment: function(date,a,b,c) {
        if (date) {
          moment_helper = require('helper-moment');
          return moment_helper(date,a,b,c);
        }
        return "Fecha desconocida";
      },
      format_amount: function(value) {
        if (value) {
          return "$"+value.toLocaleString('es-MX',
            {
              style: 'decimal',
              maximumFractionDigits: 0
            });
        }
        return 'Importe desconocido';
      },
      j: function(obj) {
        return util.inspect(obj,{ depth: 5, maxArrayLength: 1000 }).replace(RegExp("&#x27;","g"),"\"");
      },
      get_year: function(date) {
        //TODO
        return date;
      },
      flag_name: function (flag_id) {
        const flag_names = {
          conf: "Confiabilidad",
          traz: "Trazabilidad",
          trans: "Transparencia",
          comp: "Competitividad",
          temp: "Temporalidad",
          total_score: "Puntaje total"
        }
        return flag_names[flag_id];
      },
      flag_recommendations: function (org, count) {
        // console.log(org);
        //TODo: Elegir cuales mostrar

        const recommendations = [
          {category: "Confiabilidad", name:"Una bandera de confiabilidad", score: 0.342342, text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod libero quam corporis, omnis id, tenetur totam ipsam sed debitis, eos, repudiandae! Eius facere repellendus, reprehenderit voluptate obcaecati at odit illo."},
          {category: "Trazabilidad", name:"Una bandera de trazabilidad", score: 0.342342, text: "Recomendaciones  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod libero quam corporis, omnis id, tenetur totam ipsam sed debitis, eos, repudiandae! Eius facere repellendus, reprehenderit voluptate obcaecati at odit illo. Confiabilidad"},
          {category: "Transparencia", name:"Una bandera de transparencia", score: 0.342342, text: count+"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod libero quam corporis, omnis id, tenetur totam ipsam sed debitis, eos, repudiandae! Eius facere repellendus, reprehenderit voluptate obcaecati at odit illo."},
        ]
        return recommendations;
      },
      filter_array: function(haystack,property,needle) {
        const search = {};
        search[property] = needle;
        const item = _.find(haystack,search);
        console.log("filter_array",search,item);
        return item;
      },
      fix_compranet_url: function(url) {
        const fixed = url.replace("funcionpublica.gob.mx","hacienda.gob.mx");
        return fixed;
      },
      format_score: function(value) {
        //TODO
        if (value || value === 0) {
          return (value*100).toLocaleString('es-MX',
            {
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })+"%";
        }
        return '(no evaluado)';
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
            case '!!':
                return (!v1 && !v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
      },
      isArray: function(obj) {
        return typeof obj == "object";
      },
      format_number: function(value) {
        if (value || value === 0) {
           const formatted = value.toLocaleString('es-MX', {style: "decimal"});
           // console.log("format_number", formatted);
           return formatted;
        }
        return 'Valor desconocido';
      },
      hilight: function(needle, haystack) {
        const r = new RegExp("("+needle+")","i");
        // console.log("hilight",r,haystack);
        return haystack.replace(r, "<span class='hilight'>$1</span>");
      },
      match: function(needle, haystack) {
        const r = new RegExp("("+needle+")","i");
        // console.log("match",r,haystack);
        if (haystack.toString().match(r)) {
          return true;
        }
        for (e in haystack) {
          // console.log(haystack[e],haystack[e].name.toString(),r);
          if (haystack[e].name.toString().match(r)) {
            return true;
          }
        }
        return false;
      },
      get_record_flags: function(contract_flags) {
        // console.log("get_record_flags 1",contract_flags);
        const record_flags = {
          total_score: 0,
          trans: 0,
          temp: 0,
          comp: 0,
          traz: 0,
          rules: []
        }
        const rules = {};

        for (contract in contract_flags) {
          record_flags.total_score += contract_flags[contract].contract_score.total_score;
          record_flags.trans += contract_flags[contract].contract_score.trans;
          record_flags.temp += contract_flags[contract].contract_score.temp;
          record_flags.comp += contract_flags[contract].contract_score.comp;
          record_flags.traz += contract_flags[contract].contract_score.traz;

          for (category in contract_flags[contract].rules_score) {
            for (rule in contract_flags[contract].rules_score[category]) {
              if (contract_flags[contract].rules_score[category][rule] === 0) {
                if (!rules[rule]) {
                  rules[rule] = 1;
                }
                else {
                  rules[rule]++;
                }
              }
            }
          }
        }
        record_flags.total_score = record_flags.total_score/contract_flags.length
        record_flags.trans = record_flags.trans/contract_flags.length;
        record_flags.temp = record_flags.temp/contract_flags.length;
        record_flags.comp = record_flags.comp/contract_flags.length;
        record_flags.traz = record_flags.traz/contract_flags.length;
        for (rule in rules) {
          let rule_obj = {
            name: rule,
            count: rules[rule]
          };
          record_flags.rules.push(rule_obj);
        }

        // console.log("get_record_flags 2",record_flags);

        return record_flags;
      },
      get_type_url: function(type) {
        switch(type) {
          case "institution": return "instituciones-publicas"; break;
          case "company": return "empresas"; break;
          case "contract": return "contratos"; break;
          case "person": return "personas"; break;
          case "funder": return "instituciones-publicas"; break;
          default: console.log("get_type_url",type); return "unknown"; break;
        }
      },
      get_party_type: function(records,party_id) {
        let party;
        if (records) {
          party = _.find(records.compiledRelease.parties,{id: party_id});
          // console.log("get_party_type not", party);
          if (!party) {
            party = _.find(records.compiledRelease.parties,(party,i,parties) => {
              // console.log(party.memberOf,party_id);
              if (party.memberOf) { return party.memberOf[0].id == party_id }
              // console.log("get_party_type memberOf",party);
            })
            // console.log("get_party_type",party)
            if (party) {
              return party.details.type;
            }
          }
          if (party && party.details) {
            return party.details.type;
          }
          else {
            console.log("get_party_type not found",party_id);
            return "unknown";
          }
        }
        else {
          console.log("get_party_type no record");
          return "unknown";

        }
      },
      get_record_funder: function(records) {
        let party;
        if (records) {
          party = _.find(records.compiledRelease.parties,{roles: ["funder"]});
          if (party) {
            return party;
          }
          else {
            console.log("get_record_funder not found");
            return null;
          }
        }
        else {
          console.log("get_record_funder no record");
          return null;

        }
      },
      url_csv: function(url) {
        if (url) {
          return url.replace("v2/","v2/csv/");
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
// app.use('/users', usersRouter);

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
  res.render('error', { error: true });
});

module.exports = app;
