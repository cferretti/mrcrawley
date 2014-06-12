var mongoose = require('mongoose');

var SitemapSchema = new mongoose.Schema({
  _id : String,
  domain : String,
  links : [],
  assets : {
    styles : [],
    scripts: [],
    images : [],
    others : [],
  }
}, { collection : 'sitemap' });

module.exports = mongoose.model('SitemapSchema', SitemapSchema);