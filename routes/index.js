var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var errorCatcher = require('async-error-catcher');
var lib = require('../lib.js');

let catchError = errorCatcher.default;

/* GET home page. */
router.get('/', catchError(async function(req, res, next) {
  let feed = await lib.getFeed(req);
 
  res.render('home', { feed: feed, home: true,  });
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
  console.log(filters)
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

  console.log(filters);
  res.render('persons', {result: result, pagesArray:arrayNum,current_url:url_without_page,current_page:current_page, filters:lib.cleanFilters(filters)});
}));


/* GET organizations index */
router.get('/orgs', catchError(async function(req, res, next) {
  let filters = lib.getFilters(req.query);

  let current_page = req.query.page || 0;
  filters.offset = current_page*25;

  result = await lib.getAPI(req,"organizations",filters);

  var arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));
  
  res.render('organizations', {result: result,pagesArray:arrayNum,current_url:lib.cleanURL(req.originalUrl),current_page:current_page, filters:lib.cleanFilters(filters)});
}));

/* GET contract view */
router.get('/contracts/:id', catchError(async function(req, res, next) {
  let filters = {
    ocid: req.params.id, //lo que viene de req de la url
    suppliers_org: req.query.supplier //lo que viene de req de la url
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
    simple: req.params.id //lo que viene de req de la url
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
router.get('/orgs/:id', catchError(async function(req, res, next) {
  let filters = {
    simple: req.params.id
  };
  var id = req.params.id;
  result = await lib.getAPI(req, "organizations", filters);
  // console.log("organization",result);
  // console.log(id);
  if (!result.data[0]) {
    let err = new Error("Organización no encontrada");
    err.status = 404;
    throw(err);
  }
  res.render('organization', {result: result.data[0]});
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
