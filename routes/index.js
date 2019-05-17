var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let feed = await getFeed();
  res.render('home', { feed: feed, home: true });
});

/* GET contratcs index. */
router.get('/contracts', async function(req, res, next) {
  let filters = {};
  result = await getAPI("organizations",filters);
  console.log("contracts",result);
  res.render('contracts', {result: result});
});

/* GET persons index. */
router.get('/persons', async function(req, res, next) {
  res.render('persons');
});

/* GET organizations index. */
router.get('/organizations', async function(req, res, next) {
  res.render('organizations');
});

/* GET contract view. */
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

async function getFeed() {
  let Parser = require('rss-parser');
  let parser = new Parser();

  let feed = await parser.parseURL('https://www.rindecuentas.org/feed/');
  return feed.items.slice(0,3);
}

async function getAPI(collection,filters) {
  let Qqw = require('qqw');

  var client = new Qqw();

  var params = {}; //params recibe fields para filtrar los campos que envia y text que no se que es

  for (f in filters) {
    params[f] = filters[f];
  }

  client.get(collection, params, function(error, result, response) {
    console.log("getAPI",result);
  });

}

module.exports = router;
