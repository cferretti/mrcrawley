var router  = require('express').Router();
var sitemapApi = require('./sitemap');

router.use('/sitemap', sitemapApi);

module.exports = router;