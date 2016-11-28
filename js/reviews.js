var app = angular.module('getPuppiesImages', []);

app.controller('ReviewsCtrl', ['$scope', '$http', function ($scope, $http) {
    var URL = 'https://spreadsheets.google.com/feeds/list/15St6mqHfH7ghGtFs4ze8-WFr0h7ZXjc5CUWUCQ4OoOU/ojq12n1/public/full?alt=json';
    var MAPPINGS = {
        1: 'Timestamp',
        2: 'Name',
        3: 'Purchase',
        4: 'Picture',
        5: 'Agree',
        6: 'Review',
        7: 'ImageURL'
    }

    var load_reviews = function () {
        $http.get(URL).then(function (resp) {
            $scope.reviews = [];

            var flatData = resp.data.feed.entry;
            var prevDate = null, ordercount = 0;

            for(var i = 0 ; i < flatData.length; i++) {
                if(flatData[i]['gs$cell'] != undefined) {
                    // Cell Mode

                    var cell = flatData[i]['gs$cell'];
                    if(cell['row'] === '1') {
                        continue;
                    }

                    if(cell['row'] === '1') {
                        $scope.reviews.push({});
                    }
                } else {
                    // Form Mode

                    var row = flatData[i];
                    var review = {}

                    for(var attr in row) {
                        if(attr.substring(0, 4) === "gsx$") {
                            review[attr.substring(4)] = row[attr].$t;
                        }
                    }

                    $scope.reviews.push(review);
                }

            }

            console.log($scope.reviews);

        });
    }

    load_reviews();

}]);
