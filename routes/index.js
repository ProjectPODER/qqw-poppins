var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var errorCatcher = require('async-error-catcher');

let catchError = errorCatcher.default;

/* GET home page. */
router.get('/', catchError(async function(req, res, next) {
  let feed = await getFeed(req);
  res.render('home', { feed: feed, home: true });
}));

/* GET contratcs index. */
router.get('/contracts', catchError(async function(req, res, next) {
  let filters = {};
  if (req.query.proveedor) {
    filters.suppliers_org = "/"+req.query.proveedor+"/i"
  }
  if (req.query.dependencia) {
    filters["buyer.name"] = "/"+req.query.dependencia+"/i"
    filters["parties.memberOf"] = "/"+req.query.dependencia+"/i"
  }
  result = await getAPI(req,"contracts",filters);
  // console.log("contracts",result);
  console.log(req.query.proveedor)
  res.render('contracts', {result: result});
}));

/* GET persons index */
router.get('/persons',catchError(async function(req, res, next) {
  let filters = {}
  if (req.query.filtername) {
    filters.name = "/"+req.query.filtername+"/i"
  }
  result = await getAPI(req,"persons",filters);
  res.render('persons', {result: result});
}));

/* GET organizations index */
router.get('/orgs', catchError(async function(req, res, next) {
  let filters = {}
  if (req.query.filtername) {
    filters.name = "/"+req.query.filtername+"/i"
  }
  result = await getAPI(req,"organizations",filters);
  res.render('organizations', {result: result});
}));

/* GET contract view */
router.get('/contracts/:id', catchError(async function(req, res, next) {
  let filters = {
    ocid: req.params.id, //lo que viene de req de la url
    suppliers_org: req.query.supplier //lo que viene de req de la url
  };
  result = await getAPI(req,"contracts",filters);
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
  result = await getAPI(req,"persons",filters);
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
  result = await getAPI(req, "organizations", filters);
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

  // CONTACT PAGE FORM
  var mailOptions = {
      to: "info@quienesquien.wiki",
      subject: 'Mensaje desde QuienesQuien.Wiki',
      from: "QuienesQuien.Wiki <info@quienesquien.wiki>",
      html:  "From: " + req.body.name + "<br>" + "Subject: " + req.body.subjectMail + "<br>" +
             "User's email: " + req.body.email + "<br>" + "Message: " + req.body.message
  }

  if (req.body.type == "info") {
  // SEND INFORMATION FORM
    mailOptions.subject = 'Información aportada a través de QQW',
    mailOptions.html=  "From: " + req.body.email + "<br>" +
                       "Information: " + req.body.message + "<br>" + "Source: " + req.body.source
  }

  let smtpTransport = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER || "",
        port: process.env.EMAIL_PORT || "587",
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER || "", // generated ethereal user
            pass: process.env.EMAIL_PASS || "" // generated ethereal password
        }
  });

  smtpTransport.sendMail(mailOptions, function (err, response) {
      if (err) {
          console.log(err);
          res.end('{"status": "error"}');
      } else {
          console.log("Message sent: " + response.message);
          res.end('{"status": "sent"}');
      }
  });

});

async function getFeed(req) {
  let Parser = require('rss-parser');
  let parser = new Parser();

  console.log(process.env);

  let feed = await parser.parseURL(process.env.FEED_URL);
  return feed.items.slice(0,3);
}

async function getAPI(req,collection,filters) {
  let Qqw = require('qqw');

  var client = new Qqw({rest_base: process.env.API_BASE});

  var params = []; //params recibe fields para filtrar los campos que envia y text que no se que es

  for (f in filters) {
    params[f] = filters[f];
  }

  if (collection=="contracts") {
    params.sort="-amount";
  }
  if (collection=="persons" || collection=="organizations") {
    params.sort="-ocds_contract_count";
  }

  try {
    result = await client.get_promise(collection, params);
  }
  catch(e) {
    throw(new Error(e));
  }

  if (result.error) {
    err = new Error(result.error);
    err.status=500;
    throw(err);
  }
  // console.log("result",result);
  return result.data;
}


module.exports = router;
