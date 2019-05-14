var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let feed = await getFeed();
  res.render('home', { feed: feed, title: 'home' });
});

/* GET contratcs index. */
router.get('/contracts', async function(req, res, next) {
  let filters = {};
  result = await getAPI();
  console.log("contracts",result);
  res.render('contracts', {result: result});
});


async function getFeed() {
  let Parser = require('rss-parser');
  let parser = new Parser();

  let feed = await parser.parseURL('https://www.rindecuentas.org/feed/');
  return feed.items.slice(0,3);
}

async function getAPI(filters) {
  let Qqw = require('qqw');

  var client = new Qqw();

  var params = {}; //params recibe fields para filtrar los campos que envia y text que no se que es

  for (f in filters) {
    params[f] = filters[f];
  }

  client.get('organizations', params, function(error, organizations, response) {
    console.log("getAPI",organizations);
  });

}

module.exports = router;
