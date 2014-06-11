var request = require('request');
var async = require('async');
var url = require('url');
var mime = require('mime');
var mongodb = require('mongodb');
var client = mongodb.MongoClient;

const MAX_WORKERS = 5;
const MONGO_URL = 'mongodb://localhost/sitemap';
const WEBSITE_URL = 'https://codio.com';

var regexp = new RegExp(/(href|src|content|action|rel)=("|')((http[s]*\:\/\/codio\.com\/|\/|\.\.\/[a-zA-Z0-9]*)+[\/a-zA-Z0-9_\-\.]+)("|')/g);

client.connect(MONGO_URL, function(error, db){
	if(error){
		throw error;
	}

	createSiteMap(db);
});

var createSiteMap = function(db){
	console.log('***********Create Site Map**************');

	var worker = async.queue(function(object, next){
		request(
			{
				url : object.url,
				method: 'GET'
			},  
			function finish (error, response, body){
				if(error) {
			        return next(error);
			    }

			    //Recuperer le sitemap
			    db.collection('sitemap').findOne({ _id : object.sitemapId }, function(error, sitemap){
				    //Chercher les liens !
				    var matches = regexp.exec(body);
				    while(matches !== null){
				    	var founded = url.resolve(object.url, matches[3]);
				    	var type = mime.lookup(founded);
				    	//If html and not in links of sitemap then add it and add it to worker
				    	if(type == 'application/octet-stream' && sitemap.links.indexOf(founded) < 0){
				    		sitemap.links.push(founded);
				    		worker.push({ url : founded, sitemapId : sitemap._id });
							console.log('Added and entered => ' +  founded );
				    	}else if(sitemap.links.indexOf(founded) < 0){ //Else if not exit add it
				    		sitemap.links.push(founded);
							console.log('Added  => ' +  founded );
				    	}

				    	//next regexp
				    	matches = regexp.exec(body)
				    }

				    //Update sitemap with the news links
				    db.collection('sitemap').update({_id : sitemap._id}, sitemap , function(error, result){
				    	if(error) {
					        next(error);
					    }

				    	next();
					});
			    });
			}
		);

	}, MAX_WORKERS);
	
	worker.drain = function drain(){
		console.log('******************Finish****************');
		process.exit();
	};

	//Insert en db
	db.collection('sitemap').insert({ links : [ WEBSITE_URL ] }, function(error, result){
		if(error) {
          throw error;
        }
        //Start once it added to sitemap collection
		worker.push({ url : WEBSITE_URL, sitemapId : result[0]._id });
	});

}