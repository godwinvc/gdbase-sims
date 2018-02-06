angular.module("gdbaseSims")
    .controller("simsController", ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {
        $scope.logoutHandler = function () {
            $http.post(baseURL + './server/logout.php', $stateParams.user).then(function (res) {
                if (res.status == 200) {
                    localStorage.removeItem('gdbaseToken');
                    $state.go('login');
                } else {
                    console.log(res);
                }
            }).catch(function (err) {
                console.error(err);
            })
        }
    }])