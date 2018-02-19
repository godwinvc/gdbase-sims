angular.module("gdbaseSims").controller("simSelectController", [
  "$scope",
  "$state",
  function($scope, $state) {
    var checkSimulationAccess = function(currentSimulationNum) {
      if (currentSimulationNum == "simulation1") {
        if ($scope.userSimData.accountActivated) {
          return true;
        } else {
          $("#activationModal").modal();
          return false;
        }
      } else {
        if ($scope.userSimData.simulationMetadata[currentSimulationNum].paid) {
          return true;
        } else {
          alert(
            "Something went wrong! Please let us know what happend using contact page."
          );
          return false;
        }
      }
    };
    $scope.openSimulation = function(currentSimulationNum) {
      if (checkSimulationAccess(currentSimulationNum)) {
        $state.go("sims.simulation", {
          currentSimulation: currentSimulationNum
        });
      }
    };
  }
]);
