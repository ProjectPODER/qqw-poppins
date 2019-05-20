var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let feed = await getFeed(req);
  res.render('home', { feed: feed, home: true });
});

/* GET contratcs index. */
router.get('/contracts', async function(req, res, next) {
  let filters = {};
  result = await getAPI(req);
  console.log("contracts",result);
  res.render('contracts', {result: result});
});

/* GET persons index */
router.get('/persons', async function(req, res, next) {
  let filters = {
    // name: name;
  };
  // ?name=/res/i
  result = await getAPI(req, 'persons', filters);
  console.log("persons",result);
  res.render('persons', {result: result);
});

/* GET organizations index */
router.get('/organizations', async function(req, res, next) {
  res.render('organizations');
});

/* GET contract view */
router.get('/contract', async function(req, res, next) {
  res.render('contract');
});

/* GET person view. */
router.get('/person', async function(req, res, next) {
  res.render('person');
});

/* GET organization view. */
router.get('/organization', async function(req, res, next) {
  res.render('organization');
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

async function getFeed(req) {
  let Parser = require('rss-parser');
  let parser = new Parser();

  let feed = await parser.parseURL(req.app.get("config").FEED_URL);
  return feed.items.slice(0,3);
}

async function getAPI(req, collection, filters) {
  let Qqw = require('qqw');
  let results_return = {};

  var client = new Qqw({rest_base: req.app.get("config").API_BASE});

  var params = {}; //params recibe fields para filtrar los campos que envia y text que no se que es


  for (f in filters) {
    params[f] = filters[f];
  }

  client.get(collection,  params, async function(error, results, response) {
    console.log("getAPI",results);
    results_return = results;
    return results;
  });

  return results_return;
}


module.exports = router;
