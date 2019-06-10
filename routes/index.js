var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var errorCatcher = require('async-error-catcher');

let catchError = errorCatcher.default;

/* GET home page. */
router.get('/', async function(req, res, next) {
  let feed = await getFeed(req);
  res.render('home', { feed: feed, home: true });
});

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
router.get('/persons', async function(req, res, next) {
  let filters = {}
  if (req.query.filtername) {
    filters.name = "/"+req.query.filtername+"/i"
  }
  result = await getAPI(req,"persons",filters);
  res.render('persons', {result: result});
});

/* GET organizations index */
router.get('/orgs', async function(req, res, next) {
  let filters = {}
  if (req.query.filtername) {
    filters.name = "/"+req.query.filtername+"/i"
  }
  result = await getAPI(req,"organizations",filters);
  res.render('organizations', {result: result});
});

/* GET contract view */
router.get('/contracts/:id', async function(req, res, next) {
  let filters = {
    ocid: req.params.id, //lo que viene de req de la url
    suppliers_org: req.query.supplier //lo que viene de req de la url
  };
  result = await getAPI(req,"contracts",filters);
  // console.log("contracts",result);
  // console.log(filters.ocid);
  res.render('contract', {result: result.data[0]});
});

/* GET person view. */
router.get('/persons/:id', async function(req, res, next) {
  let filters = {
    simple: req.params.id //lo que viene de req de la url
  };
  var id = req.params.id;
  result = await getAPI(req,"persons",filters);
  // console.log("person",result);
  console.log(id);
  res.render('person', {result: result.data[0]});
});

/* GET organization view. */
router.get('/orgs/:id', async function(req, res, next) {
  let filters = {
    simple: req.params.id
  };
  var id = req.params.id;
  result = await getAPI(req, "organizations", filters);
  // console.log("organization",result);
  console.log(id);
  res.render('organization', {result: result.data[0]});
});

/* GET about */
router.get('/about', async function(req, res, next) {
  res.render('about');
});

/* GET apis */
router.get('/apis', async function(req, res, next) {
  res.render('apis');
});

/* GET privacy */
router.get('/privacy', async function(req, res, next) {
  res.render('privacy');
});

/* GET contact */
router.get('/contact', async function(req, res, next) {
  res.render('contact');
});

router.post('/send', function (req, res) {
  // CONTACT PAGE FORM

  //TODO: Validar parámetros y devolver error
  //TODO: Protegernos del SPAM
  var mailOptions = {
      to: "info@quienesquien.wiki",
      subject: 'Mensaje desde QuienesQuien.Wiki',
      from: "QuienesQuien.Wiki <info@quienesquien.wiki>",
      html:  "From: " + req.body.name + "<br>" + "Subject: " + req.body.subjectMail + "<br>" +
             "User's email: " + req.body.email + "<br>" + "Message: " + req.body.text
  }

  if (req.body.send_info_form = "true") {
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

  console.log(mailOptions);
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

  let feed = await parser.parseURL(req.app.get("config").FEED_URL);
  return feed.items.slice(0,3);
}

async function getAPI(req,collection,filters) {
  let Qqw = require('qqw');

  var client = new Qqw({rest_base: req.app.get("config").API_BASE});

  var params = {}; //params recibe fields para filtrar los campos que envia y text que no se que es

  for (f in filters) {
    params[f] = filters[f];
  }

  result = await client.get_promise(collection, params);
  return result.data;
}


module.exports = router;
