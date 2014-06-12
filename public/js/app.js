var app = angular.module('mrCrawley', []);

app.controller('HomeCtrl', [ '$scope', 'Sitemap', function HomeCtrl($scope, Sitemap){
	$scope.sitemap = null;
	$scope.get = function get(){
		Sitemap.get(function(err, data){
			if(err){
				alert('Error');
				return;
			}
			$scope.sitemap = data;
		});
	};

	$scope.get();

}]);

app.factory('Sitemap', ['$http', function($http){
	return {
		get : function(callback){
			$http({method: 'GET', url: '/api/sitemap/'}).
		    success(function(data, status, headers, config) {
		    	callback(null, data);
		    }).
		    error(function(data, status, headers, config) {
		    	callback(data, null);	
		    });
		}
	}
	
}]);

app.filter('urltopath', [ '$location', function($location){
  return function(url, domain) {
  		var el = document.createElement('a');
		el.href = url;
		return el.pathname
  };
}]);