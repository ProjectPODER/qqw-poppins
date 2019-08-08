var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var lib = require('../lib.js');

var errorCatcher = require('async-error-catcher');
let catchError = errorCatcher.default;

/* GET home page. */
router.get('/', catchError(async function(req, res, next) {
  let feed, stats, alert;

  // Always render home even without API
  try {
    feed = await lib.getFeed(req);
    persons = await lib.getAPI(req,"persons",{limit:1, sort:"-date"});
    institutions = await lib.getAPI(req,"institutions",{limit:1, sort:"-date"});
    companies = await lib.getAPI(req,"companies",{limit:1, sort:"-date"});
    contracts = await lib.getAPI(req,"contracts",{limit:1, sort:"-compiledRelease.date"});

    stats = {
      persons: {
        count: persons.count,
        lastModified: persons.data[0] ? persons.data[0].date : "API ERROR"
      },
      institutions: {
        count: institutions.count,
        lastModified: institutions.data[0] ?  institutions.data[0].date : "API ERROR"
      },
      companies: {
        count: companies.count,
        lastModified: companies.data[0] ?  companies.data[0].date : "API ERROR"
      },
      contracts: {
        count: contracts.count,
        lastModified: contracts.data[0] ? contracts.data[0].records[0].compiledRelease.date : "Error de API"
      }
    }
  }
  catch(e) {
    alert = "No se pudieron recuperar algunas fuentes de datos, por favor contáctenos si este error le afecta.";
    console.error("Error",e);
  }


  res.render('home', { feed: feed, home: true, stats:stats, alert: alert  });
}));

/* GET contratcs index. */
router.get('/contratos', lib.searchPage("contracts"));

/* GET persons index */
//TODO: Default filters
router.get('/personas', lib.searchPage("persons"));

/* GET institutions index */
//Don't bring UCs
router.get('/instituciones-publicas', lib.searchPage("institutions",{"subclassification": "!unidad-compradora", "sort": "-contract_amount"}));

router.get('/unidades-compradoras', lib.searchPage("institutions",{"subclassification": "unidad-compradora", "sort": "-contract_amount"}));

/* GET companies index */
router.get('/empresas', lib.searchPage("companies",{sort: "-contract_amount"}));

function entityPage(collection,templateName,idFieldName) {
  return catchError(async function(req, res, next) {
    let filters = {
      limit: 1,
      sort: ""
    };
    filters[idFieldName] = req.params.id;

    result = await lib.getAPI(req,collection,filters);
    if (!result.data[0]) {
      let err = new Error("No encontrado: "+collection);
      err.status = 404;
      throw(err);
    }
    res.render(templateName, {result: result.data[0], type: collection});
  })
}

/* GET contract view */
router.get('/contratos/:id', entityPage("contracts","contract","ocid"));

/* GET person view. */
router.get('/personas/:id', entityPage("persons","perfil","id"));

/* GET organization view. */
router.get('/instituciones-publicas/:id', entityPage("institutions","perfil","id"));

router.get('/empresas/:id', entityPage("company","perfil", "id"));

/* GET about */
router.get('/sobre-qqw', catchError(async function(req, res, next) {
  res.render('about', { about: true });
}));

/* GET about/sources */
router.get('/entidades-y-fuentes', catchError(async function(req, res, next) {
  res.render('sources' , { sources: true });
}));

/* GET apis */
router.get('/herramientas', catchError(async function(req, res, next) {
  res.render('apis' , { apis: true });
}));

/* GET about/investigations */
router.get('/investigaciones', catchError(async function(req, res, next) {
  res.render('investigations' , { investigations: true });
}));

/* GET about/manual */
router.get('/manual', catchError(async function(req, res, next) {
  res.render('manual' , { manual: true });
}));

/* GET about/partners */
router.get('/aliados', catchError(async function(req, res, next) {
  res.render('partners' , { partners: true });
}));

/* GET privacy */
router.get('/privacidad', catchError(async function(req, res, next) {
  res.render('privacy');
}));

/* GET contact */
router.get('/contacto', catchError(async function(req, res, next) {
  res.render('contact' , { contact: true });
}));

/* GET  */
router.get('/perfil', catchError(async function(req, res, next) {
  res.render('perfil');
}));

router.post('/send', function (req, res) {

  //TODO: Protegernos del SPAM

  let fieldsWidthError = []
  if (!req.body.email || req.body.email.indexOf("@") == -1) {
      fieldsWidthError.push("email");
  }
  if (!req.body.message) {
      fieldsWidthError.push("message");
  }
  if (fieldsWidthError.length>0) {
    let result = {
      "status": "error",
      "message": "Some fields have errors",
      "fieldsWidhError": fieldsWidthError
    }
    res.end(JSON.stringify(result));
    return false;
  }


  lib.sendMail(mailOptions, function (err, response) {
      if (err) {
          console.log(err);
          res.end('{"status": "error"}');
      } else {
          console.log("Message sent: " + response.message);
          res.end('{"status": "sent"}');
      }
  });

});



module.exports = router;
