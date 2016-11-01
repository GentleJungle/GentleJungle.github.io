var app = angular.module('getPuppiesImages', []);

var ACCESS_TOKEN = '1518439702.1677ed0.9dac48d4464f43cf890c3273f37b79ae';
var FEED_NUMBER = 20;

function selectPuppies(feed) {
	for (var i in feed.tags) {
		if (feed.tags[i] == 'gentlejunglepuppy') {
			return feed
		}
	}
}

function getIns() {
	return $q(function() {
		$.ajax({
			method: 'GET',
			url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + ACCESS_TOKEN + '&count=' + FEED_NUMBER,
			dataType: "jsonp",
		}).then(
			function(message) {
				$log.log( 'success' )
				$scope.puppies = message.data.filter(selectPuppies)
			},
			function() {
				$log.log( 'failed' )
			}
		);
	})
}

app.controller('getImageCtlr', function($scope, $q, $log) {
	$scope.try = 5
	$scope.puppies = 1;

	function getIns() {
		return $q(function(resolve, reject) {
			$.ajax({
				method: 'GET',
				url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + ACCESS_TOKEN + '&count=' + FEED_NUMBER,
				dataType: "jsonp",
			}).then(
				function(message) {
					// $log.log( 'success' )
					resolve(message.data.filter(selectPuppies))
				},
				function(error) {
					// $log.log( 'failed' )
					reject(error)
				}
			);
		})
	}

	var promise = getIns();
	promise.then(
		function(puppies) {
			$scope.puppies = puppies
			$('#puppies').removeClass('hidden').addClass('show')
			$('#spinner').removeClass('show').addClass('hidden')
		},
		function(error) {
			$log.log(error)
		}
	)
});
