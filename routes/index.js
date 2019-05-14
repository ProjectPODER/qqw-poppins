var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('home', { feed: await getFeed() });
});

async function getFeed() {
  let Parser = require('rss-parser');
  let parser = new Parser();

  let feed = await parser.parseURL('https://www.rindecuentas.org/feed/');
  return feed.items.slice(0,3);
}

module.exports = router;
