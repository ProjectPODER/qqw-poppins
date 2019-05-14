var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let feed = await getFeed();
  res.render('home', { feed: feed });
});

/* GET contratcs index. */
router.get('/contracts', async function(req, res, next) {
  let filters = {};
  result = await getAPI("organizations",filters);
  console.log("contracts",result);
  res.render('contracts', {result: result});
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
