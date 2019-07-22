var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var errorCatcher = require('async-error-catcher');
var lib = require('../lib.js');

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
    contracts = await lib.getAPI(req,"contracts",{limit:1, sort:"-publishedDate"});

    stats = {
      persons: {
        count: persons.pages,
        lastModified: persons.data[0] ? persons.data[0].date : "API ERROR"
      },
      institutions: {
        count: institutions.pages,
        lastModified: institutions.data[0] ?  institutions.data[0].date : "API ERROR"
      },
      companies: {
        count: companies.pages,
        lastModified: companies.data[0] ?  companies.data[0].date : "API ERROR"
      },
      contracts: {
        count: contracts.pages,
        lastModified: contracts.data[0] ? contracts.data[0].publishedDate : "Error de API"
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
router.get('/contracts', catchError(async function(req, res, next) {
  let filters = lib.getFilters(req.query);

  let current_page = req.query.page || 0;
  filters.offset = current_page*25;

  let url_without_page = lib.cleanURL(req.originalUrl);

  result = await lib.getAPI(req,"contracts",filters);

  var arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));

  // console.log("contracts",result);
  // console.log(filters)
  res.render('contracts', {result: result, pagesArray:arrayNum,current_url:url_without_page,current_page:current_page, filters:lib.cleanFilters(filters)});
}));

/* GET persons index */
router.get('/persons',catchError(async function(req, res, next) {
  let filters = lib.getFilters(req.query);

  let current_page = req.query.page || 0;
  filters.offset = current_page*25;

  let url_without_page = lib.cleanURL(req.originalUrl);

  result = await lib.getAPI(req,"persons",filters);

  var arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));
  // console.log(current_page);
  // console.log(filters.offset);
  // console.log(req.body.person_index_length)
  res.render('persons', {result: result, pagesArray:arrayNum,current_url:url_without_page,current_page:current_page, filters:lib.cleanFilters(filters)});
}));


/* GET institutions index */
router.get('/instituciones', catchError(async function(req, res, next) {
  let filters = lib.getFilters(req.query);

  let current_page = req.query.page || 0;
  filters.offset = current_page*25;
  filters.sort = "-contract_amount";

  result = await lib.getAPI(req,"institutions",filters);

  var arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));

  res.render('institutions', {result: result,pagesArray:arrayNum,current_url:lib.cleanURL(req.originalUrl),current_page:current_page, filters:lib.cleanFilters(filters)});
}));

/* GET institutions index */
router.get('/empresas', catchError(async function(req, res, next) {
  let filters = lib.getFilters(req.query);

  let current_page = req.query.page || 0;
  filters.offset = current_page*25;
  filters.sort = "-contract_amount";

  result = await lib.getAPI(req,"companies",filters);

  var arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));

  res.render('companies', {result: result,pagesArray:arrayNum,current_url:lib.cleanURL(req.originalUrl),current_page:current_page, filters:lib.cleanFilters(filters)});
}));

/* GET contract view */
router.get('/contracts/:id', catchError(async function(req, res, next) {
  let filters = {
    records_compiledRelease_ocid: req.params.id, //lo que viene de req de la url
    sort: ""
  };
  result = await lib.getAPI(req,"contracts",filters);
  // console.log("contracts",result);
  // console.log(filters.ocid);
  if (!result.data[0]) {
    let err = new Error("Contrato no encontrado");
    err.status = 404;
    throw(err);
  }
  res.render('contract', {result: result.data[0]});
}));

/* GET person view. */
router.get('/persons/:id', catchError(async function(req, res, next) {
  let filters = {
    id: req.params.id //lo que viene de req de la url
  };
  var id = req.params.id;
  result = await lib.getAPI(req,"persons",filters);
  // console.log("person",result);
  // console.log(id);
  if (!result.data[0]) {
    let err = new Error("Persona no encontrada");
    err.status = 404;
    throw(err);
  }
  res.render('person', {result: result.data[0]});
}));

/* GET organization view. */
router.get('/instituciones/:id', catchError(async function(req, res, next) {
  let filters = {
    id: req.params.id
  };
  result = await lib.getAPI(req, "institutions", filters);
  // console.log("organization",result);
  // console.log(id);
  if (!result.data[0]) {
    let err = new Error("Institución no encontrada");
    err.status = 404;
    throw(err);
  }
  res.render('institution', {result: result.data[0]});
}));

router.get('/empresas/:id', catchError(async function(req, res, next) {
  let filters = {
    id: req.params.id
  };
  result = await lib.getAPI(req, "companies", filters);
  // console.log("organization",result);
  // console.log(id);
  if (!result.data[0]) {
    let err = new Error("Empresa no encontrada");
    err.status = 404;
    throw(err);
  }
  res.render('company', {result: result.data[0]});
}));

/* GET about */
router.get('/about', catchError(async function(req, res, next) {
  res.render('about');
}));

/* GET apis */
router.get('/apis', catchError(async function(req, res, next) {
  res.render('apis');
}));

/* GET privacy */
router.get('/privacy', catchError(async function(req, res, next) {
  res.render('privacy');
}));

/* GET contact */
router.get('/contact', catchError(async function(req, res, next) {
  res.render('contact');
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
