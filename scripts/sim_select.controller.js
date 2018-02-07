angular.module("gdbaseSims")
    .controller("simSelectController", ['$scope', '$state', function ($scope, $state) {
        var checkSimulationAccess = function (currentSimulationNum) {
            if (currentSimulationNum == 'simulation1') {
                if ($scope.userSimData.accountActivated) {
                    return true;
                } else {
                    $('#activationModal').modal();
                    return false;
                }
            }
        }
        $scope.openSimulation = function (currentSimulationNum) {
            if (checkSimulationAccess(currentSimulationNum)) {
                $state.go('sims.simulation', {
                    currentSimulation: currentSimulationNum
                });
            }
        }
    }])