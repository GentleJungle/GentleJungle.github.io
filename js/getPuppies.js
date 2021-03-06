var app = angular.module('getPuppiesImages', []);

var ACCESS_TOKEN = '1518439702.1677ed0.9dac48d4464f43cf890c3273f37b79ae'; // basic scope access token required
var FEED_NUMBER = 20;

function selectPuppies(feed) {
	for (var i in feed.tags) {
		if (feed.tags[i] == 'gentlejunglepuppy') {
			return feed
		}
	}
}

app.controller('getImageCtlr', function($scope, $q, $log) {

	var nextUrl, pageNumber
	var storage = [] //store all the feeds received, so no need to ask for the same feeds again when hit prev or next

	function getIns(URL) {
		return $q(function(resolve, reject) {
			$.ajax({
				method: 'GET',
				url: URL,
				dataType: "jsonp",
			}).then(
				function(message) {
					if (message.meta.code != 200) {
						reject( message.meta.error_message )
					} else {
						$log.log(message)
						resolve( message )
					}
				}
			);
		})
	}

	var firstUrl = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + ACCESS_TOKEN + '&count=' + FEED_NUMBER
	var promise = getIns(firstUrl)
	promise.then(
		function(message) {
			var puppies = message.data.filter(selectPuppies)
			$scope.puppies = puppies
			storage.push(puppies)
			pageNumber = 0
			nextUrl = message.pagination.next_url
			$('#puppies').removeClass('hidden').addClass('show')
			$('#spinner').removeClass('show').addClass('hidden')
		},
		function(error) {
			$log.error(error)
			$('#spinner').removeClass('show').addClass('hidden')
			$('#errorMessage').removeClass('hidden').addClass('show')
			$scope.errorMessage = "The application has encountered an unknown error. Our technical staff have been automatically notified and will be looking into this with the utmost urgency."
		}
	)

	$scope.next = function() {
		pageNumber ++
		if (pageNumber === 1) {
			$('#prev').removeClass('not-active')
		}
		if (pageNumber < storage.length) {
			$scope.puppies = storage[pageNumber]
		} else {
			var promise = getIns(nextUrl)
			promise.then(
				function(message) {
					var puppies = message.data.filter(selectPuppies)
					$scope.puppies = puppies
					storage.push(puppies)
					$log.log(storage)
					nextUrl = message.pagination.next_url
				},
				function(error) {
					$log.error(error)
				}
			)
		}
	}

	$scope.prev = function() {
		pageNumber --
		$scope.puppies = storage[pageNumber]
		if (pageNumber === 0)
			$('#prev').addClass('not-active')
	}
});
