angular.module("gdbaseSims")
  .controller("simulationController", ["$scope", "$http", "$state", "$stateParams", function ($scope, $http, $state, $stateParams) {
    $scope.currentSimulation = $stateParams.currentSimulation;
    $scope.currentSimulationNum = parseInt(
      $scope.currentSimulation.replace("simulation", "")
    );
    $scope.currentQuestion = "intro";
    $scope.simData = null;
    $scope.currentQuestionData = null;
    $scope.currSelectedOptions = [];
    var questionTemplate = {
      selectedOptions: [],
      attempted: false,
      marks: 0
    }
    $scope.beginSimulation = function (simNum) {
      $http.get(baseURL + "./server/sims.json")
        .then(function (response) {
          $scope.simData = response.data[$scope.currentSimulation];
          if ($scope.userSimData[$scope.currentSimulation] == undefined) {
            $scope.userSimData[$scope.currentSimulation] = {};
            updateCurrentQuestionData(1);
          }

        })
        .catch(function (err) {
          console.error(err);
          alert("Unable to access the simulation! Please use the contact page to inform us.");
        });
    };

    $scope.loadNextQuestion = function () {
      $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].attempted = true;
      $scope.currentQuestion++;
      updateCurrentQuestionData($scope.currentQuestion);
    };

    $scope.loadPreviousQuestion = function () {
      $scope.currentQuestion--;
      updateCurrentQuestionData($scope.currentQuestion);
    };

    $scope.OpSelectionHandler = function (op) {

      switch ($scope.currentQuestionData.questionType) {
        case "MC":
          MC_Handler();
          break;

        case "MR":
          MR_Handler();
          break;

        default:
          console.error("Unknown Question type: " + $scope.currentQuestionData.questionType);
          break;
      }

      function MC_Handler() {
        if ($scope.currSelectedOptions.indexOf(op) > -1) {
          $scope.currSelectedOptions.splice($scope.currSelectedOptions.indexOf(op), 1);
        } else {
          $scope.currSelectedOptions = [];
          $scope.currSelectedOptions.push(op);
        }
      }

      function MR_Handler() {
        if ($scope.currSelectedOptions.indexOf(op) > -1) {
          $scope.currSelectedOptions.splice($scope.currSelectedOptions.indexOf(op), 1);
        } else {
          $scope.currSelectedOptions.push(op);
        }
      }
      $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].selectedOptions = $scope.currSelectedOptions;
      console.log($scope.userSimData[$scope.currentSimulation]);
    }


    // regular functions
    function updateCurrentQuestionData(currQusNum) {
      $scope.currentQuestion = currQusNum;
      $scope.currentQuestionData = $scope.simData["Q" + $scope.currentQuestion];
      if (!$scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion]) {
        $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion] = questionTemplate;
      } else {
        if (!$scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].attempted) {
          console.log('already attempted');
        }
      }
      $scope.currSelectedOptions = $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].selectedOptions;
      console.log($scope.currSelectedOptions);
    }
  }]);