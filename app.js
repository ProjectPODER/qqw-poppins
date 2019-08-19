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


const flag_categories = {
  conf: "Confiabilidad",
  traz: "Trazabilidad",
  trans: "Transparencia",
  comp: "Competitividad",
  temp: "Temporalidad",
  total_score: "Puntaje total"
}

const flag_details = {
  "trans-ov": {
    name: "OCDS válido",
    category: "Transparencia",
    level: "contract",
    description: "Es un documento válido OCDS o no",
    type: "bool",
    contract_string: "No cumple con el estándar de datos de contrataciones abiertas - OCDS",
    uc_string: "",
    hidden_uc: true,
  },
  "trans-sc": {
    name: "Secciones completas",
    category: "Transparencia",
    level: "contract",
    description: "Contiene todas las secciones principales de OCDS",
    type: "percent",
    contract_string: "Le falta información en una o más de las cinco secciones principales del estándar OCDS",
    uc_string: "",
    hidden_uc: true,
  },
  "trans-cc": {
    name: "Campos completos",
    category: "Transparencia",
    level: "contract",
    description: "Porcentaje de campos de OCDS que existen y tienen valor en el contrato",
    type: "percent",
    contract_string: "No tiene datos en todos los campos definidos por el OCDS",
    uc_string: "",
    hidden_uc: true,
  },
  "temp-cft": {
    level: "contract",
    category: "Temporalidad",
    name: "Campos fundamentales para la temporalidad",
    description: "Existe una fecha valida en los campos publicación de la oportunidad, adjudicación de contrato, inicio contrato y fin de contrato.",
    type: "percent",
    contract_string: "Le falta una o más fechas fundamentales para el proceso de contratración",
    uc_string: "Se deben reportar todas las fechas relevantes del contrato: fecha de apertura y cierre de recepción de propuestas, fecha de adjudicación, fecha inicio y fecha fin del contrato. También para procesos restringidos como adjudicación directa o invitación a tres.",
    hidden_uc: false,
  },
  "temp-dl": {
    level: "contract",
    category: "Temporalidad",
    name: "Duración larga",
    description: "La diferencia entre el inicio y fin de contrato supera los 1000 días",
    type: "bool",
    contract_string: "La diferencia entre el inicio y fin de contrato supera los 1000 días",
    uc_string: "Se realizan contratos por un tiempo demasiado largo, se recomienda hacer contratos más cortos ya que permiten un mejor seguimiento.",
    hidden_uc: false,
  },
  "temp-tipo": {
    level: "contract",
    category: "Temporalidad",
    name: "Tiempo insuficiente de preparación de ofertas",
    description: "La diferencia entre el inicio y fin de contrato supera los 1000 días",
    type: "bool",
    contract_string: "La diferencia entre la fecha de publicación y cierre de recepción de ofertas es menor a 15 días",
    uc_string: "En varios contratos el tiempo para preparar la oferta es insuficiente, esto genera in eficiencias en el proceso de contratación y podría ir contra la ley.",
    hidden_uc: false,
  },
  "temp-fs": {
    level: "contract",
    category: "Temporalidad",
    name: "Fechas sospechosas",
    description: "El contrato se celebra en fechas no laborales del gobierno o feriados oficiales",
    type: "bool",
    contract_string: "El contrato se ha celebrado en feriados oficiales o fechas no laborales del gobierno",
    uc_string: "Demasiados contratos firmados en festivo o feriado. Se recomienda trabajar menos y hacer las cosas en sus debidos tiempos.",
    hidden_uc: false,
  },
  "comp-cfc": {
    level: "contract",
    category: "Competitividad",
    name: "Fechas sospechosas",
    description: "Campos fundamentales para la competitividad",
    type: "percent",
    contract_string: "Le falta el tipo de procedimiento o el nombre del proveedor",
    uc_string: "Ser más cuidadosos y poner siempre el método del contrato y el nombre del proveedor.",
    hidden_uc: false,
  },
  "comp-pf": {
    level: "contract",
    category: "Competitividad",
    name: "Paraísos fiscales",
    description: "El proveedor está basado en uno de los países con score > 65 en el global secrecy index",
    type: "bool",
    contract_string: "El proveedor tiene su residencia en un paraíso fiscal",
    uc_string: "Establecer una nueva clausula que penalice aquellas empresas que tienen su residencia legal en un paraíso fiscal.",
    hidden_uc: false,
  },
  "traz-cft": {
    level: "contract",
    category: "Trazabilidad",
    name: "Campos fundamentales para la trazabilidad",
    description: "Tiene algún dato que relaciona al contrato con presupuesto y los distintos actores que participan en el contrato están identificados.",
    type: "percent",
    contract_string: "Falta uno o más datos para vincular el contrato con el presupuesto y los actores participantes",
    uc_string: "Siempre poner la información necesaria para vincular el contrato con el presupuesto.",
    hidden_uc: false,
  },
  "traz-ei": {
    level: "contract",
    category: "Trazabilidad",
    name: "Escala inconsistente",
    description: "La escala reportada por el comprador y proveedor no coinciden",
    type: "bool",
    contract_string: "Inconsistencia entre la escala demanda y la escala de la empresa ganadora",
    uc_string: "Ser más coherentes entre la escala de la empresa (micro-pequeña-mediana-grande) demandada y la escala que tiene la empresa que ganó el contrato.",
    hidden_uc: false,
  },
  "traz-fro": {
    level: "contract",
    category: "Trazabilidad",
    name: "Falta de referencia oficial",
    description: "No se incluye un enlace a la publicación oficial",
    type: "bool",
    contract_string: "No tiene un enlace para verificar los datos que están en la base de datos",
    uc_string: "Ser más coherentes entre la escala de la empresa (micro-pequeña-mediana-grande) demandada y la escala que tiene la empresa que ganó el contrato.",
    hidden_uc: false,
  },
  "traz-ir": {
    level: "contract",
    category: "Trazabilidad",
    name: "Importe redondeado",
    description: "El importe del contrato es un múltiplo de 10,000",
    type: "bool",
    contract_string: "El contrato es un importe redondeado.",
    uc_string: "Ser más exhaustivos en los costes del contrato para no acabar dando un importe redondeado -y probablemente aproximado- como bueno.",
    hidden_uc: false,
  },
  "traz-ip": {
    level: "contract",
    category: "Trazabilidad",
    name: "Información de las partes",
    description: "Cada parte involucrada tiene información de contacto de algún tipo",
    type: "bool",
    contract_string: "Cada una de las partes involucradas tiene algún tipo de información de contacto",
    uc_string: "Las empresas con las que trabajan deben tener algún tipo de contacto más allá del nombre.",
    hidden_uc: false,
  },
  "traz-mc": {
    level: "contract",
    category: "Trazabilidad",
    name: "Modificaciones al contrato",
    description: "El contrato ha sufrido modificaciones desde su publicación",
    type: "bool",
    contract_string: "El contrato ha sufrido modificaciones",
    uc_string: "Demasiados contratos que realizan sufren modificaciones una vez ya se han publicado.",
    hidden_uc: false,
  },
  "traz-pf": {
    level: "contract",
    category: "Trazabilidad",
    name: "Proveedor fantasma",
    description: "El proveedor no tiene código RUPC, o éste no viene incluido",
    type: "bool",
    contract_string: "El proveedor no se dio de alta en el registro de proveedores únicos",
    uc_string: "Las empresas con las que trabajan no se dan de alta en el Registro Único de Proveedores y Contratistas.",
    hidden_uc: false,
  },
  "traz-ct": {
    level: "contract",
    category: "Trazabilidad",
    name: "Comprensión del título",
    description: "El título es descriptivo y claro, no consiste solamente de códigos o abreviaciones",
    type: "bool",
    contract_string: "El título es genérico y no refleja con precisión el propósito del contrato",
    uc_string: "Los títulos de los contratos contienen códigos o palabras vacías que los hacen incompresibles para la ciudadanía.",
    hidden_uc: false,
  },
  "conf": {
    level: "party",
    category: "Confiabilidad",
    name: "Confiabilidad",
    description: "Score que se calcula con base a las partes con las cuales un comprador/proveedor se relaciona",
    type: "percent",
    contract_string: "Los actores involucrados en el contrato tienen puntuaciones bajas",
    uc_string: "Se realizan contratos con empresas que participan en contratos con datos de baja calidad.",
    hidden_uc: false,
  },
  "aepm": {
    level: "node",
    category: "Competitividad",
    name: "% Agente Económico Preponderante (AEP) por monto",
    description: "Alto porcentaje del monto total de adjudicaciones de una dependencia/UC al mismo proveedor",
    type: "percent",
    contract_string: "",
    uc_string: "No contratar importes tan altos con un único proveedor para evitar que este tenga una posición preponderante dentro de la institución",
    hidden_uc: false,
  },
  "aepc": {
    level: "node",
    category: "Competitividad",
    name: "% AEP por cantidad de contratos",
    description: "Alto porcentaje de la cantidad de adjudicaciones de una dependencia/UC al mismo proveedor",
    type: "percent",
    contract_string: "",
    uc_string: "No realizar un porcentaje de contratos tan alto con un único proveedor para evitar que este tenga una posición preponderante dentro de la institución",
    hidden_uc: false,
  },
  "tcr": {
    level: "node",
    category: "Trazabilidad",
    name: "Títulos de contrato repetidos",
    description: "El nombre del contrato se repite en un 10% de los casos. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Ser más específicos con los nombres de los contratos y no repetir nombres como “Servicios profesionales”.",
    hidden_uc: false,
  },
  "mcr": {
    level: "node",
    category: "Trazabilidad",
    name: "Montos de contratos repetidos",
    description: "El monto del contrato se repite en un 10% de los casos. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Ser más exhaustivos con los presupuestos presentados y tareas contratadas para evitar repetir montos de contrato el mismo año",
    hidden_uc: false,
  },
  "celp": {
    level: "node",
    category: "Competitividad",
    name: "Concentración de excepciones a la licitación púb.",
    description: "El 33% del importe total de las adjudicaciones/invitaciones a tres de una dependencia van hacia la misma empresa",
    type: "percent",
    contract_string: "",
    uc_string: "Abrir los procesos de contratación y no abusar de las adjudicaciones e invitaciones a tres.",
    hidden_uc: false,
  },
  "rla": {
    level: "node",
    category: "Competitividad",
    name: "Rebasa el límite asignado",
    description: "Una dependencia/UC contrata más del 30% del importe total por adjudicación e invitación a tres",
    type: "percent",
    contract_string: "",
    uc_string: "Esta bandera es más que una recomendación, se podría estar vulnerado la ley al haber contratado más del 30% del importe anual por adjudicación directa.",
    hidden_uc: false,
  },
  "ncap": {
    level: "node",
    category: "Competitividad",
    name: "Número de contratos arriba del promedio",
    description: "Una dependencia realiza el 30% de sus contratos del año en un mismo dia. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Los momentos con mucho trabajo son complicados, mejor realiza las contrataciones espaciadas y no concentradas todas en un mismo dia.",
    hidden_uc: false,
  },
}



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
        return flag_categories[flag_id];
      },

      contract_recommendations: function(flag) {
        return flag_details[flag];
      },
      flag_recommendations: function (org, count) {
        // console.log(org);
        //TODo: Elegir cuales mostrar
        //Seleccionar las 3 más cercanas al mínimo. Utilizar cero mientras no haya mínimo.
        selected_flags = ["traz-ei","traz-pf","tcr"];

        const recommendations = [
          flag_details[selected_flags[0]],flag_details[selected_flags[1]],flag_details[selected_flags[2]],
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
