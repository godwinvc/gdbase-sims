angular.module("gdbaseSims")
  .controller("simulationController", ["$scope", "$http", "$state", "$stateParams", function ($scope, $http, $state, $stateParams) {

    $scope.currentSimulation = $stateParams.currentSimulation;
    $scope.currentSimulationNum = parseInt(
      $scope.currentSimulation.replace("simulation", "")
    );
    $scope.currentQuestion = "intro";
    $scope.simData = null;
    $scope.currentQuestionData = null;
    $scope.userSim = {};
    var questionTemplate = {
      selectedOptions: [],
      attempted: false,
      marks: 0
    }

    $http.post(baseURL + "./server/get-user-sim.php", {
        username: $stateParams.user
      })
      .then(function (response) {
        $scope.userSim = response.data;
      }).catch(function (err) {
        console.log(err);
      })
    $scope.beginSimulation = function (simNum) {
      $http.get(baseURL + "./server/sims.json")
        .then(function (response) {
          $scope.simData = response.data[$scope.currentSimulation];
          $scope.currentQuestion = 1;
          $scope.currentQuestionData = $scope.simData["Q" + $scope.currentQuestion];
          if ($scope.userSim[$scope.currentSimulation] == undefined) {
            $scope.userSim[$scope.currentSimulation] = {};
          }
          $scope.userSim[$scope.currentSimulation]["Q" + $scope.currentQuestion] = questionTemplate;
          console.log($scope.userSim);
        })
        .catch(function (err) {
          console.log(err);
          alert("Unable to access the simulation! Please use the contact page to inform us.");
        });
    };

    $scope.loadNextQuestion = function () {
      $scope.currentQuestion++;
      $scope.currentQuestionData = $scope.simData["Q" + $scope.currentQuestion];
    };

    $scope.loadPreviousQuestion = function () {
      $scope.currentQuestion--;
      $scope.currentQuestionData = $scope.simData["Q" + $scope.currentQuestion];
    };
  }]);