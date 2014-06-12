var express = require('express');
var apiRouter = require('./api');
var mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/sitemap';
mongoose.connect(MONGO_URL);

var app = express();
app.use('/api', apiRouter);
app.use(express.static(__dirname));

var port = process.env.PORT || 1337;
app.listen(port);

module.exports = app;