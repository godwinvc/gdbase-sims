angular.module("gdbaseSims")
    .controller("simSelectController", ['$scope', '$state', function ($scope, $state) {
        $scope.openSimulation = function (currentSimulationNum) {
            $state.go('sims.simulation', {
                currentSimulation: currentSimulationNum
            });
        }
    }])