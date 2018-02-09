angular.module("gdbaseSims")
  .controller("simulationController", ["$scope", "$http", "$state", "$stateParams", "$interval", function ($scope, $http, $state, $stateParams, $interval) {
    var Timeloop = null;
    $scope.currentSimulation = $stateParams.currentSimulation;
    $scope.currentSimulationNum = parseInt(
      $scope.currentSimulation.replace("simulation", "")
    );
    $scope.timer = {
      "hours": 0,
      "mins": 0,
      "secs": 0
    }
    $scope.currentQuestion = "intro";
    $scope.simData = null;
    $scope.currentQuestionData = null;
    $scope.currSelectedOptions = [];
    $scope.score = 0;
    $scope.beginSimulation = function (simNum) {
      $http.get(baseURL + "./server/sims.json")
        .then(function (response) {
          $scope.simData = response.data[$scope.currentSimulation];
          if ($scope.userSimData[$scope.currentSimulation] == undefined) {
            $scope.userSimData[$scope.currentSimulation] = {};
            updateCurrentQuestionData(1);
          }
          StartTimer();
        })
        .catch(function (err) {
          console.error(err);
          alert("Unable to access the simulation! Please use the contact page to inform us.");
        });
    };

    $scope.loadNextQuestion = function () {
      calculateScore();
      if ($scope.currSelectedOptions.length > 0) {
        $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].attempted = true;
      }
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
    }


    // regular functions
    function updateCurrentQuestionData(currQusNum) {
      $scope.currentQuestion = currQusNum;
      $scope.currentQuestionData = $scope.simData["Q" + $scope.currentQuestion];
      if (!$scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion]) {
        $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion] = {
          selectedOptions: [],
          attempted: false,
          marks: 0
        };
      } else {
        if (!$scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].attempted) {
          console.log('already attempted');
        }
      }
      $scope.currSelectedOptions = $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].selectedOptions;
    }

    function calculateScore() {
      var score = $scope.score;
      $scope.currSelectedOptions.forEach(function (op, opi) {
        var opData = $scope.currentQuestionData.options[op];
        if (opData.type == "correct") {
          score = score + opData.mark;
        } else {
          score = score - opData.mark;
        }
      });
      $scope.score = score;
    }

    function StartTimer() {
      var date = new Date();
      //var _countDownDate = new Date(date.setTime(date.getTime() + ($scope.simData.TimeLimit.hours * 60 * 60 * 1000) + ($scope.simData.TimeLimit.mins * 60 * 1000) + ($scope.simData.TimeLimit.secs * 1000))).toString();
      //var countDownDate = new Date(_countDownDate).getTime();
      var countDownDate = new Date(date.setTime(date.getTime() + ($scope.simData.TimeLimit.hours * 60 * 60 * 1000) + ($scope.simData.TimeLimit.mins * 60 * 1000) + ($scope.simData.TimeLimit.secs * 1000) + $scope.simData.TimeLimit.ms));

      Timeloop = $interval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        $scope.timer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        $scope.timer.mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        $scope.timer.secs = Math.floor((distance % (1000 * 60)) / 1000);
        if (distance < 0) {
          $interval.cancel(Timeloop);
        }
      }, 1000);
    }
  }]);