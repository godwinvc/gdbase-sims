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
        $http.get(baseURL + "./server/check-purchase.php")
            .then(function (res) {
                var purchaseData = null;
                if(typeof res.data == "object"){
                    purchaseData = res.data;
                    if(!purchaseData.simulation2){
                        purchaseData = null;
                    }
                };
                if (purchaseData != null) {
                    Object.keys(purchaseData).forEach(function (v, i) {
                        $scope.userSimData.simulationMetadata[v].paid = purchaseData[v];
                    });
                    updateUserData();
                }
            }).catch(function (err) {
                console.error(err);
            })

        function updateUserData() {
            $http.post(baseURL + "./server/update-sim-data.php", {
                    "username": $stateParams.user,
                    "simulation": $scope.userSimData
                })
                .then(function (res) {
                    console.log(res.data);
                }).catch(function (err) {
                    console.error(err);
                })
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
                            setTimeout(function () {
                                $('#activationModal').modal('hide');
                            }, 1500);
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
    }]);