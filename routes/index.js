var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let feed = await getFeed(req);
  res.render('home', { feed: feed });
});

/* GET contratcs index. */
router.get('/contracts', async function(req, res, next) {
  let filters = {};
  result = await getAPI(req);
  console.log("contracts",result);
  res.render('contracts', {result: result});
});


async function getFeed(req) {
  let Parser = require('rss-parser');
  let parser = new Parser();

  let feed = await parser.parseURL(req.app.get("config").FEED_URL);
  return feed.items.slice(0,3);
}

async function getAPI(req,filters) {
  let Qqw = require('qqw');

  var client = new Qqw({rest_base: req.app.get("config").API_DOMAIN});

  var params = {}; //params recibe fields para filtrar los campos que envia y text que no se que es

  for (f in filters) {
    params[f] = filters[f];
  }

  client.get('organizations', params, function(error, organizations, response) {
    console.log("getAPI",organizations);
  });

}


module.exports = router;
