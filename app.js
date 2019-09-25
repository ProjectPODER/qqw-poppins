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

const contract_categories_min_max = {
    "max-contract_score-total_score" : 0.8145347394540943,
    "min-contract_score-total_score" : 0.3652233250620347,
    "max-contract_score-trans" : 0.5169727047146402,
    "min-contract_score-trans" : 0.3414474772539289,
    "max-contract_score-temp" : 1,
    "min-contract_score-temp" : 0,
    "max-contract_score-comp" : 1,
    "min-contract_score-comp" : 0,
    "max-contract_score-traz" : 0.75,
    "min-contract_score-traz" : 0.25,
    "max-rules_score-trans-ov" : 0,
    "min-rules_score-trans-ov" : 0,
    "max-rules_score-trans-sc" : 1,
    "min-rules_score-trans-sc" : 0.8333333333333334,
    "max-rules_score-trans-cc" : 0.2,
    "min-rules_score-trans-cc" : 0.12923076923076923,
    "max-rules_score-trans-ccm" : 0.8709677419354839,
    "min-rules_score-trans-ccm" : 0.4032258064516129,
    "max-rules_score-temp-cft" : 1,
    "min-rules_score-temp-cft" : 0,
    "max-rules_score-temp-tipo" : 1,
    "min-rules_score-temp-tipo" : 0,
    "max-rules_score-temp-dl" : 1,
    "min-rules_score-temp-dl" : 0,
    "max-rules_score-temp-fs" : 1,
    "min-rules_score-temp-fs" : 0,
    "max-rules_score-comp-cfc" : 1,
    "min-rules_score-comp-cfc" : 0,
    "max-rules_score-comp-pf" : 1,
    "min-rules_score-comp-pf" : 0,
    "max-rules_score-traz-ei" : 1,
    "min-rules_score-traz-ei" : 0,
    "max-rules_score-traz-cft" : 0,
    "min-rules_score-traz-cft" : 0,
    "max-rules_score-traz-mc" : 1,
    "min-rules_score-traz-mc" : 0,
    "max-rules_score-traz-ip" : 0,
    "min-rules_score-traz-ip" : 0,
    "max-rules_score-traz-pf" : 1,
    "min-rules_score-traz-pf" : 0,
    "max-rules_score-traz-ir" : 1,
    "min-rules_score-traz-ir" : 0,
    "max-rules_score-traz-ct" : 1,
    "min-rules_score-traz-ct" : 0,
    "max-rules_score-traz-fro" : 1,
    "min-rules_score-traz-fro" : 0
}

const party_categories_min_max = {
    "max-contract_categories-total_score" : 0.8149193548387097,
    "min-contract_categories-total_score" : 0.43852253928866836,
    "max-contract_categories-trans" : 0.5185111662531018,
    "min-contract_categories-trans" : 0.3414474772539289,
    "max-contract_categories-temp" : 1,
    "min-contract_categories-temp" : 0,
    "max-contract_categories-comp" : 1,
    "min-contract_categories-comp" : 0.5,
    "max-contract_categories-traz" : 0.75,
    "min-contract_categories-traz" : 0.25,
    "max-contract_rules-trans-ov" : 0,
    "min-contract_rules-trans-ov" : 0,
    "max-contract_rules-trans-sc" : 1,
    "min-contract_rules-trans-sc" : 0.833333333333307,
    "max-contract_rules-trans-ccm" : 0.8709677419354839,
    "min-contract_rules-trans-ccm" : 0.4032258064516129,
    "max-contract_rules-trans-cc" : 0.20615384615384616,
    "min-contract_rules-trans-cc" : 0.12923076923076923,
    "max-contract_rules-temp-cft" : 1,
    "min-contract_rules-temp-cft" : 0,
    "max-contract_rules-temp-tipo" : 1,
    "min-contract_rules-temp-tipo" : 0,
    "max-contract_rules-temp-dl" : 1,
    "min-contract_rules-temp-dl" : 0,
    "max-contract_rules-temp-fs" : 1,
    "min-contract_rules-temp-fs" : 0,
    "max-contract_rules-comp-cfc" : 1,
    "min-contract_rules-comp-cfc" : 0,
    "max-contract_rules-comp-pf" : 1,
    "min-contract_rules-comp-pf" : 0,
    "max-contract_rules-traz-ei" : 1,
    "min-contract_rules-traz-ei" : 0,
    "max-contract_rules-traz-cft" : 0,
    "min-contract_rules-traz-cft" : 0,
    "max-contract_rules-traz-mc" : 1,
    "min-contract_rules-traz-mc" : 0,
    "max-contract_rules-traz-ip" : 0,
    "min-contract_rules-traz-ip" : 0,
    "max-contract_rules-traz-pf" : 1,
    "min-contract_rules-traz-pf" : 0,
    "max-contract_rules-traz-ir" : 1,
    "min-contract_rules-traz-ir" : 0,
    "max-contract_rules-traz-ct" : 1,
    "min-contract_rules-traz-ct" : 0,
    "max-contract_rules-traz-fro" : 1,
    "min-contract_rules-traz-fro" : 0,
    "max-node_rules-conf" : 0.8129032258064516,
    "min-node_rules-conf" : 0.47116521918941273,
    "max-node_rules-aepm" : 1,
    "min-node_rules-aepm" : 0,
    "max-node_rules-aepc" : 1,
    "min-node_rules-aepc" : 0,
    "max-node_rules-tcr10" : 1,
    "min-node_rules-tcr10" : 0,
    "max-node_rules-mcr10" : 1,
    "min-node_rules-mcr10" : 0,
    "max-node_rules-celp" : 1,
    "min-node_rules-celp" : 0,
    "max-node_rules-rla" : 1,
    "min-node_rules-rla" : 0,
    "max-node_rules-ncap3" : 1,
    "min-node_rules-ncap3" : 0,
    "max-node_categories-comp" : 1,
    "min-node_categories-comp" : 0,
    "max-node_categories-traz" : 1,
    "min-node_categories-traz" : 0,
    "max-node_categories-total_score" : 1,
    "min-node_categories-total_score" : 0,
    "max-category_score-comp" : 1,
    "min-category_score-comp" : 0.25,
    "max-category_score-traz" : 0.875,
    "min-category_score-traz" : 0.125,
    "max-total_score" : 0.898266129032258,
    "min-total_score" : 0.21926126964433418
}

const flag_categories = {

  conf: {
    name: "Confiabilidad",
    info: "Una organización es tan confiable como el promedio de aquellas con las que se relaciona."
  } ,
  traz: {
    name: "Trazabilidad",
    info: "Se puede seguir el dinero del presupuesto al ítem y se conocen los detalles de todos los actores involucrados."
  },
  trans: {
    name: "Transparencia",
    info: "Cumple con estándares internacionales de contrataciones abiertas."
  },
  comp: {
    name: "Competitividad",
    info: "El proceso de contratación fue una competencia justa y abierta."
  },
  temp: {
    name: "Temporalidad",
    info: "Se respetan los tiempos de los distintos procesos dentro la contratación."
  },
  total_score: {
    name: "Puntaje total",
    info: "Promedio de todas categorías."
  }
}

const flag_details = {
  "trans-ov": {
    id: "trans-ov",
    name: "OCDS válido",
    category: "Transparencia",
    level: "contract",
    description: "Es un documento válido OCDS o no.",
    type: "bool",
    contract_string: "No cumple con el estándar de datos de contrataciones abiertas - OCDS.",
    uc_string: "",
    hidden_uc: true,
  },
  "trans-sc": {
    id: "trans-sc",
    name: "Secciones completas",
    category: "Transparencia",
    level: "contract",
    description: "Contiene todas las secciones principales de OCDS.",
    type: "percent",
    contract_string: "Le falta información en una o más de las cinco secciones principales del estándar OCDS.",
    uc_string: "",
    hidden_uc: true,
  },
  "trans-cc": {
    id: "trans-cc",
    name: "Campos completos",
    category: "Transparencia",
    level: "contract",
    description: "Porcentaje de campos de OCDS que existen y tienen valor en el contrato.",
    type: "percent",
    contract_string: "No tiene datos en todos los campos definidos por el OCDS.",
    uc_string: "",
    hidden_uc: true,
  },
  "temp-cft": {
    id: "trans-cft",
    level: "contract",
    category: "Temporalidad",
    name: "Campos fundamentales para la temporalidad",
    description: "Existe una fecha valida en los campos: publicación de la oportunidad, adjudicación de contrato, inicio contrato y fin de contrato.",
    type: "percent",
    contract_string: "Le falta una o más fechas fundamentales para el proceso de contratración.",
    uc_string: "Se deben reportar todas las fechas relevantes del contrato: fecha de apertura y cierre de recepción de propuestas, fecha de adjudicación, fecha inicio y fecha fin del contrato. También para procesos restringidos como adjudicación directa o invitación a tres.",
    hidden_uc: false,
  },
  "temp-dl": {
    id: "temp-dl",
    level: "contract",
    category: "Temporalidad",
    name: "Duración larga",
    description: "La diferencia entre el inicio y fin de contrato supera los 1000 días.",
    type: "bool",
    contract_string: "La diferencia entre el inicio y fin de contrato supera los 1000 días.",
    uc_string: "Se realizan contratos por un tiempo demasiado largo, se recomienda hacer contratos más cortos ya que permiten un mejor seguimiento.",
    hidden_uc: false,
  },
  "temp-tipo": {
    id: "temp-tipo",
    level: "contract",
    category: "Temporalidad",
    name: "Tiempo insuficiente de preparación de ofertas",
    description: "La diferencia entre la fecha de publicación y cierre de recepción de ofertas es menor a 15 días.",
    type: "bool",
    contract_string: "La diferencia entre la fecha de publicación y cierre de recepción de ofertas es menor a 15 días.",
    uc_string: "En varios contratos el tiempo para preparar la oferta es insuficiente, esto genera ineficiencias en el proceso de contratación y podría ir contra lo estipulado en la ley.",
    hidden_uc: false,
  },
  "temp-fs": {
    id: "temp-fs",
    level: "contract",
    category: "Temporalidad",
    name: "Fechas sospechosas",
    description: "El contrato se celebra en fechas no laborales del gobierno o feriados oficiales.",
    type: "bool",
    contract_string: "El contrato se ha celebrado en feriados oficiales o fechas no laborales del gobierno.",
    uc_string: "Demasiados contratos firmados en festivo o feriado. Se recomienda trabajar de forma más eficiente y hacer las cosas en sus debidos tiempos.",
    hidden_uc: false,
  },
  "comp-cfc": {
    id: "comp-cfc",
    level: "contract",
    category: "Competitividad",
    name: "Campos fundamentales para la competitividad",
    description: "Existe un proveedor con nombre válido y especifican el tipo de procedimiento del contrato. Bandera en porcentaje.",
    type: "percent",
    contract_string: "Le falta el tipo de procedimiento o el nombre del proveedor.",
    uc_string: "Ser más cuidadosos y poner siempre el método del contrato y el nombre del proveedor.",
    hidden_uc: false,
  },
  "comp-pf": {
    id: "comp-pf",
    level: "contract",
    category: "Competitividad",
    name: "Paraísos fiscales",
    description: "El proveedor está basado en uno de los países con score > 65 en el global secrecy index.",
    type: "bool",
    contract_string: "El proveedor tiene su residencia en un paraíso fiscal.",
    uc_string: "Establecer una nueva cláusula que penalice aquellas empresas que tienen su residencia legal en un paraíso fiscal.",
    hidden_uc: false,
  },
  "traz-cft": {
    id: "traz-cft",
    level: "contract",
    category: "Trazabilidad",
    name: "Campos fundamentales para la trazabilidad",
    description: "Tiene algún dato que relaciona al contrato con presupuesto y los distintos actores que participan en el contrato están identificados.",
    type: "percent",
    contract_string: "Falta uno o más datos para vincular el contrato con el presupuesto y los actores participantes.",
    uc_string: "Siempre poner la información necesaria para vincular el contrato con el presupuesto.",
    hidden_uc: false,
  },
  "traz-ei": {
    id: "traz-ei",
    level: "contract",
    category: "Trazabilidad",
    name: "Escala inconsistente",
    description: "La escala reportada por el comprador y proveedor no coinciden.",
    type: "bool",
    contract_string: "Inconsistencia entre la escala de la demanda y la escala de la empresa ganadora.",
    uc_string: "Ser más coherentes entre la escala de la empresa (micro-pequeña-mediana-grande) demandada y la escala que tiene la empresa que ganó el contrato.",
    hidden_uc: false,
  },
  "traz-fro": {
    id: "traz-fro",
    level: "contract",
    category: "Trazabilidad",
    name: "Falta de referencia oficial",
    description: "No se incluye un enlace a la publicación oficial.",
    type: "bool",
    contract_string: "No tiene un enlace para verificar los datos que están en la base de datos.",
    uc_string: "Asociar todos los contratos publicados en la base de datos un enlace donde se pueda conseguir más información.",
    hidden_uc: false,
  },
  "traz-ir": {
    id: "traz-ir",
    level: "contract",
    category: "Trazabilidad",
    name: "Importe redondeado",
    description: "El importe del contrato es un múltiplo de 10,000.",
    type: "bool",
    contract_string: "El contrato es un importe redondeado.",
    uc_string: "Ser más exhaustivos en los costes del contrato para no acabar dando un importe redondeado -y probablemente aproximado- como bueno.",
    hidden_uc: false,
  },
  "traz-ip": {
    id: "traz-ip",
    level: "contract",
    category: "Trazabilidad",
    name: "Información de las partes",
    description: "Cada parte involucrada tiene información de contacto de algún tipo.",
    type: "bool",
    contract_string: "Cada una de las partes involucradas tiene algún tipo de información de contacto",
    uc_string: "Las empresas con las que trabajan deben tener algún tipo de contacto más allá del nombre.",
    hidden_uc: false,
  },
  "traz-mc": {
    id: "traz-mc",
    level: "contract",
    category: "Trazabilidad",
    name: "Modificaciones al contrato",
    description: "El contrato ha sufrido modificaciones desde su publicación.",
    type: "bool",
    contract_string: "El contrato ha sufrido modificaciones.",
    uc_string: "Demasiados contratos que sufren modificaciones una vez ya se han publicado.",
    hidden_uc: false,
  },
  "traz-pf": {
    id: "traz-pf",
    level: "contract",
    category: "Trazabilidad",
    name: "Proveedor fantasma",
    description: "El proveedor no tiene código RUPC, o éste no viene incluido",
    type: "bool",
    contract_string: "El proveedor no se dio de alta en el registro de proveedores únicos.",
    uc_string: "Las empresas con las que trabajan no se dan de alta en el Registro Único de Proveedores y Contratistas.",
    hidden_uc: false,
  },
  "traz-ct": {
    id: "traz-ct",
    level: "contract",
    category: "Trazabilidad",
    name: "Comprensión del título",
    description: "El título es descriptivo y claro, no consiste solamente de códigos o abreviaciones.",
    type: "bool",
    contract_string: "El título es genérico y no refleja con precisión el propósito del contrato.",
    uc_string: "Los títulos de los contratos contienen códigos o palabras vacías que los hacen incomprensibles para la ciudadanía.",
    hidden_uc: false,
  },
  "conf": {
    id: "conf",
    level: "party",
    category: "Confiabilidad",
    name: "Confiabilidad",
    description: "Score que se calcula con base a las partes con las cuales un comprador/proveedor se relaciona.",
    type: "percent",
    contract_string: "Los actores involucrados en el contrato tienen puntuaciones bajas.",
    uc_string: "Se realizan contratos con empresas que participan en contratos con datos de baja calidad.",
    hidden_uc: false,
  },
  "aepm": {
    id: "aepm",
    level: "node",
    category: "Competitividad",
    name: "% Agente Económico Preponderante (AEP) por monto.",
    description: "Alto porcentaje del monto total de adjudicaciones de una dependencia/UC al mismo proveedor.",
    type: "percent",
    contract_string: "",
    uc_string: "No contratar importes tan altos con un único proveedor para evitar que este tenga una posición preponderante dentro de la institución.",
    hidden_uc: false,
  },
  "aepc": {
    id: "aepc",
    level: "node",
    category: "Competitividad",
    name: "% AEP por cantidad de contratos",
    description: "Alto porcentaje de la cantidad de adjudicaciones de una dependencia/UC al mismo proveedor.",
    type: "percent",
    contract_string: "",
    uc_string: "No realizar un porcentaje de contratos tan alto con un único proveedor para evitar que este tenga una posición preponderante dentro de la institución.",
    hidden_uc: false,
  },
  "tcr10": {
    id: "tcr10",
    level: "node",
    category: "Trazabilidad",
    name: "Títulos de contrato repetidos",
    description: "El nombre del contrato se repite en un 10% de los casos. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Ser más específicos con los nombres de los contratos y no repetir nombres como “Servicios profesionales”.",
    hidden_uc: false,
  },
  "mcr10": {
    id: "mcr10",
    level: "node",
    category: "Trazabilidad",
    name: "Montos de contratos repetidos",
    description: "El monto del contrato se repite en un 10% de los casos. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Ser más exhaustivos con los presupuestos presentados y tareas contratadas para evitar repetir montos de contrato el mismo año.",
    hidden_uc: false,
  },
  "celp": {
    id: "celp",
    level: "node",
    category: "Competitividad",
    name: "Concentración de excepciones a la licitación púb.",
    description: "El 33% del importe total de las adjudicaciones/invitaciones a tres de una dependencia van hacia la misma empresa.",
    type: "percent",
    contract_string: "",
    uc_string: "Abrir los procesos de contratación y no abusar de las adjudicaciones e invitaciones a tres.",
    hidden_uc: false,
  },
  "rla": {
    id: "rla",
    level: "node",
    category: "Competitividad",
    name: "Rebasa el límite asignado",
    description: "Una dependencia/UC contrata más del 30% del importe total por adjudicación e invitación a tres.",
    type: "percent",
    contract_string: "",
    uc_string: "Esta bandera es más que una recomendación, se podría estar vulnerado la ley al haber contratado más del 30% del importe anual por adjudicación directa.",
    hidden_uc: false,
  },
  "ncap3": {
    id: "ncap3",
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
      encode: function(string) {
        return encodeURIComponent(string)
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
      contract_category_min: function(category) {
        return contract_categories_min_max["min-contract_score-"+category];
      },
      contract_category_max: function(category) {
        return contract_categories_min_max["max-contract_score-"+category];
      },
      party_category_min: function(category) {
        let selector = "";
        switch (category) {
          case "conf": selector = "node_rules-conf"; break;
          case "comp": selector = "node_categories-comp"; break;
          case "traz": selector = "node_categories-traz"; break;
          case "temp": selector = "contract_categories-temp"; break;
          case "trans": selector = "contract_categories-trans"; break;
        }
        return party_categories_min_max["min-"+selector];
      },
      party_category_max: function(category) {
        let selector = "";
        switch (category) {
          case "conf": selector = "node_rules-conf"; break;
          case "comp": selector = "node_categories-comp"; break;
          case "traz": selector = "node_categories-traz"; break;
          case "temp": selector = "contract_categories-temp"; break;
          case "trans": selector = "contract_categories-trans"; break;
        }
        return party_categories_min_max["max-"+selector];
      },
      contract_recommendations: function(flag) {
        return flag_details[flag];
      },
      get_party_categories: function(flags) {
        // console.log(JSON.stringify(flags,null,4));
        if (flags.contract_categories) {
          return {
            "trans": flags.contract_categories.trans,
            "temp": flags.contract_categories.temp,
            "comp": flags.node_categories.comp,
            "traz": flags.node_categories.traz,
            "conf": flags.node_rules.conf,
          }
        }
        else {
          return {"error": "no flags"};
        }
      },
      flag_recommendations: function (org_flags, count) {
        // console.log(JSON.stringify(org_flags,null,4));
        const flagsDiff = [];
        let flagsLimit = count || 3;
        console.log("flag_recommendations",flagsLimit,count)

        function get_min(flag_id) {
          if (party_categories_min_max["min-node_rules-"+flag_id] !== undefined) {
            return party_categories_min_max["min-node_rules-"+flag_id];
          }
          else {
            return  party_categories_min_max["min-contract_rules-"+flag_id];
          }
        }

        // const allFlags = _.merge(org_flags[0].node_rules,org_flags[0].contract_rules);
        const allFlags = _.merge(org_flags[0].node_rules,org_flags[0].contract_rules);
        console.log(allFlags);
        _.forEach(allFlags,(i,flag_id,flags) => {
          if (flag_id != "total_score") {
            //Seleccionar las 3 más cercanas al mínimo.
            const diff = get_min(flag_id)-parseFloat(flags[flag_id]);
            flagsDiff.push({
              flag_id: flag_id,
              diff: diff
            })
            // console.log(flag_id,"diff",flagsDiff[flag_id],"score",flags[flag_id],"min",flag_minimum);
          }
        })

        // //sort flags
        // okeys = Object.keys(flagsDiff),
        // sortedFlags = {};
        // okeys.sort((p,c) => flagsDiff[p] <= flagsDiff[c]).forEach((p,i) => sortedFlags[okeys[i]] = flagsDiff[p]);
        sortedFlags = _.orderBy(flagsDiff,"diff","desc");
        console.log("sortedFlags",sortedFlags);
        // const sortedFlagKeys = Object.keys(sortedFlags);

        const recommendations = []

        for (var i = 0;  i < flagsLimit; i++) {
          const flag = sortedFlags[i];
          if (flag && flag_details[flag.flag_id]) {
            if (flag_details[flag.flag_id].hidden_uc) {
              console.log("hidden",flag.flag_id);
              flagsLimit++;
              continue;
            }
            if (allFlags[flag.flag_id] === 0) {
              console.log("Saltando cero",flag.flag_id);
              flagsLimit++;
              continue;
            }
            const recommendation = _.clone(flag_details[flag.flag_id]);
            recommendation.score = allFlags[flag.flag_id];
            recommendation.minimum = get_min(flag.flag_id);
            recommendations.push(recommendation);
          }
          else {
            console.error("flag_recommendations","Asked for too many flags",i,flag.flag_id,flag_details[flag.flag_id]);
          }
        }
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
        if (haystack && needle) {
          const r = new RegExp("("+needle+")","i");
          // console.log("hilight",r,haystack);
          return haystack.replace(r, "<span class='hilight'>$1</span>");
        }
        else {
          return haystack;
          console.error("hilight error:",needle,haystack);
        }
      },
      match: function(needle, haystack) {
        const r = new RegExp("("+needle+")","i");
        console.log("match",r,haystack);
        if (haystack && haystack.toString().match(r)) {
          return true;
        }
        else if (haystack && typeof haystack[0] == "object") {
          for (e in haystack) {
            // console.log("match",haystack[e],haystack[e].name.toString(),r);
            if (haystack[e].name && haystack[e].name.toString().match(r)) {
              return true;
            }
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
      get_role_name: function(type) {
        switch(type) {
          case "Boardmember": return "Consejere"; break;
          case "Shareholder": return "Accionista"; break;
          default: console.log("get_role_name",type); return type; break;
        }
      },
      get_type_plural: function(type) {
        switch(type) {
          case "institutions": return "Instituciones públicas o empresas productivas del estado"; break;
          case "municipality": return "Municipios"; break;
          case "state": return "Estados"; break;
          case "company": return "Empresas o asociaciones civiles"; break;
          case "contract": return "Contratos"; break;
          case "persons": return "Personas"; break;
          case "person": return "Personas"; break;
          case "funder": return "Bancos"; break;
          default: console.log("get_type_plural",type); return "Entidades"; break;
        }
      },
      get_type_singular: function(type) {
        switch(type) {
          case "institutions": return "Institución pública o empresa productiva del estado"; break;
          case "municipality": return "Municipio"; break;
          case "state": return "Estado"; break;
          case "company": return "Empresa o asociación civil"; break;
          case "contract": return "Contrato"; break;
          case "persons": return "Persona"; break;
          case "person": return "Persona"; break;
          case "funder": return "Banco"; break;
          default: console.log("get_type_singular",type); return "Entidad"; break;
        }
      },
      get_type_url: function(type) {
        switch(type) {
          case "institutions": return "instituciones-publicas"; break;
          case "institution": return "instituciones-publicas"; break;
          case "municipality": return "instituciones-publicas"; break;
          case "state": return "instituciones-publicas"; break;
          case "company": return "empresas"; break;
          case "companies": return "empresas"; break;
          case "contract": return "contratos"; break;
          case "persons": return "personas"; break;
          case "person": return "personas"; break;
          case "funder": return "instituciones-publicas"; break;
          default: console.log("get_type_url",type); return "unknown"; break;
        }
      },
      get_party: function(records,party_id) {
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
              return party;
            }
          }
          if (party && party.details) {
            return party;
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
