angular.module('gdbaseSims')
    .controller('simulationController', ['$scope', '$http', '$state', '$stateParams', function ($scope, $http, $state, $stateParams) {
        $scope.currentSimulation = $stateParams.currentSimulation;
        $scope.currentSimulationNum = parseInt($scope.currentSimulation.replace("simulation", ""));
        $scope.currentQuestion = "intro";
        $scope.beginSimulation = function (simNum){
            
        }
    }]);