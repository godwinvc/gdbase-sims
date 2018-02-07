angular.module("gdbaseSims")
    .controller("simsController", ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {
        var userSimData = {};
        $scope.userData = {};
        $http.post(baseURL + "./server/get-user-data.php", $stateParams.user)
            .then(function (response) {
                $scope.userData = response.data;
                userSimData = response.data.simulation;
                console.log(response.data);
            }).catch(function (err) {
                console.log(err);
            })
        $scope.launchAcountActivator = function () {
            if (userSimData.accountActivated == false || userSimData.accountActivated == undefined) {
                
            }
        }
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