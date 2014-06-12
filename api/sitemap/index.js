var router  = require('express').Router();
var SitemapSchema    = require('./sitemapModel.js');
const WEBSITE_URL = 'https://codio.com';

router.get('/', function(req, res, next) {
  SitemapSchema.findOne({_id : WEBSITE_URL}, {},  function find(err, sitemap) {
    console.log(sitemap);
    res.send(sitemap);
  });
});

module.exports = router;