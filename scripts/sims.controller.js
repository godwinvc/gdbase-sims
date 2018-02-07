angular.module("gdbaseSims")
    .controller("simsController", ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {
        $scope.userSimData = {};
        $scope.userData = {};
        $scope.activationState = 'pending';
        $http.post(baseURL + "./server/get-user-data.php", $stateParams.user)
            .then(function (response) {
                $scope.userData = response.data;
                $scope.userSimData = JSON.parse(response.data.simulation);
                checkAccActivation($scope.userSimData);
            }).catch(function (err) {
                console.log(err);
            })
        var checkAccActivation = function (userData) {
            if (!userData.accountActivated) {
                $('#activationModal').modal();
            }
        }

        $scope.activateAccount = function () {
            $scope.activationState = 'activating';
            if ($scope.activationCodeEntered === $scope.userSimData.activationCode) {
                $scope.userSimData.accountActivated = true;
                $http.post(baseURL + "./server/update-sim-data.php", {
                        "username": $stateParams.user,
                        "simulation": $scope.userSimData
                    })
                    .then(function (response) {
                        if (response.data == "updated") {
                            $scope.activationState = 'activated';
                            setTimeout(function(){
                                $('#activationModal').modal('hide');
                            },1500);
                        } else {
                            console.log(response.data);
                            alert('Something went wrong! Please inform us using contact us page')
                        }
                    }).catch(function (err) {
                        console.log(err);
                    })
            } else {
                $scope.activationState = 'invalid';
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