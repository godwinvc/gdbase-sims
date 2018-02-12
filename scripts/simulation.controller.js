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
    $scope.metaData = {};
    $scope.currentQuestion = "intro";
    $scope.simData = null;
    $scope.currentQuestionData = null;
    $scope.currSelectedOptions = [];
    $scope.currentMaxScore = null;
    $scope.score = 0;
    $scope.beginSimulation = function (simNum) {
      $http.get(baseURL + "./server/sims.json")
        .then(function (response) {
          $scope.simData = response.data[$scope.currentSimulation];
          if ($scope.userSimData[$scope.currentSimulation] == undefined) {
            $scope.userSimData[$scope.currentSimulation] = {};
            $scope.userSimData.simulationMetadata[$scope.currentSimulation].attempted = true;
            $scope.userSimData.simulationMetadata[$scope.currentSimulation].timeTaken = $scope.timer;
            $scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation = "Q1";
            $scope.userSimData.simulationMetadata[$scope.currentSimulation].score = $scope.score;
            updateCurrentQuestionData(1);
          } else {
            if (!$scope.userSimData.simulationMetadata[$scope.currentSimulation].attempted) {
              $scope.userSimData.simulationMetadata[$scope.currentSimulation].attempted = true;
              $scope.userSimData.simulationMetadata[$scope.currentSimulation].timeTaken = $scope.timer;
              $scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation = "Q1";
              $scope.userSimData.simulationMetadata[$scope.currentSimulation].score = $scope.score;
              updateCurrentQuestionData(1);
            } else {
              if ($scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation != "score") {
                updateCurrentQuestionData(parseInt(
                  $scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation.replace("Q", "")
                ));
                $scope.simData.TimeLimit = $scope.userSimData.simulationMetadata[$scope.currentSimulation].timeTaken;
              }
            }
          }
          if ($scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation == "score") {
            $scope.currentQuestion = $scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation;
            $scope.score = $scope.userSimData.simulationMetadata[$scope.currentSimulation].score;
          } else {
            StartTimer();
          }
        })
        .catch(function (err) {
          console.error(err);
          alert("Unable to access the simulation! Please use the contact page to inform us.");
        });
    };

    $scope.loadNextQuestion = function () {
      calculateScore(); // activate if you need to calculate score immidieatly after a question
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
    $scope.loadScoreCard = function () {
      stopTimer();
      calculateScore();
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation = 'score';
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].score = $scope.score;
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].timeTaken = $scope.timer;
      $scope.currentQuestion = 'score';
      pushUserSimData();
    }
    $scope.OpSelectionHandler = function (op) {

      switch ($scope.currentQuestionData.questionType) {
        case "MC":
          MC_Handler();
          break;

        case "MR":
          MR_Handler();
          break;
        case "TF":
          TF_Handler();
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

      function TF_Handler() {
        if ($scope.currSelectedOptions[op.opk] != undefined) {
          if ($scope.currSelectedOptions[op.opk].ans === op.ans) {
            delete $scope.currSelectedOptions[op.opk];
          } else {
            $scope.currSelectedOptions[op.opk].ans = op.ans;
          }
        } else {
          $scope.currSelectedOptions[op.opk] = {
            "opk": op.opk,
            "ans": op.ans
          };
        }
      }
      $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].selectedOptions = $scope.currSelectedOptions;
    }


    // regular functions
    function updateCurrentQuestionData(currQusNum) {
      $scope.currentQuestion = currQusNum;
      $scope.currentQuestionData = $scope.simData["Q" + $scope.currentQuestion];
      $scope.currentMaxScore = calculateCurrentMaxScore($scope.currentQuestionData.options);
      if (!$scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion]) {
        $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion] = {
          questionType: $scope.currentQuestionData.questionType,
          selectedOptions: ($scope.currentQuestionData.questionType == 'TF') ? {} : [],
          attempted: false,
          marks: 0
        };
      } else {
        if (!$scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].attempted) {
          console.log('already attempted');
        }
      }
      $scope.currSelectedOptions = $scope.userSimData[$scope.currentSimulation]["Q" + $scope.currentQuestion].selectedOptions;
      console.log($scope.userSimData);
    }

    function calculateCurrentMaxScore(opObj) {
      var maxScore = 0;
      Object.keys(opObj).forEach(function (v, i) {
        if (typeof opObj[v].type == 'string') {
          if (opObj[v].type == 'correct') {
            maxScore += opObj[v].mark;
          }
        } else {
          maxScore += opObj[v].type.correct.mark;
        }
      })
      return maxScore;
    }

    function calculateScore() {
      var score = 0;
      var _userSimData = $scope.userSimData[$scope.currentSimulation];
      var _userQusArr = Object.keys(_userSimData);
      _userQusArr.forEach(function (quesObj) {
        if (_userSimData[quesObj].questionType == "TF") {
          Object.keys(_userSimData[quesObj].selectedOptions).forEach(function (op) {
            var opData = $scope.simData[quesObj].options[op];
            if (_userSimData[quesObj].selectedOptions[op].ans == opData.type.correct.op) {
              score = score + opData.type.correct.mark;
            } else {
              score = score - opData.type.incorrect.mark;
            }
          })
        } else {
          _userSimData[quesObj].selectedOptions.forEach(function (op, opi) {
            var opData = $scope.simData[quesObj].options[op];
            if (opData.type == "correct") {
              score = score + opData.mark;
            } else {
              score = score - opData.mark;
            }
          });
        }
      });
      // if (typeof $scope.currSelectedOptions.forEach == "function") {
      //   $scope.currSelectedOptions.forEach(function (op, opi) {
      //     var opData = $scope.currentQuestionData.options[op];
      //     if (opData.type == "correct") {
      //       score = score + opData.mark;
      //     } else {
      //       score = score - opData.mark;
      //     }
      //   });
      // } else {
      //   Object.keys($scope.currSelectedOptions).forEach(function (op, opi) {
      //     var opData = $scope.currentQuestionData.options[op];
      //     if ($scope.currSelectedOptions[op].ans === opData.type.correct.op) {
      //       score = score + opData.type.correct.mark;
      //     } else {
      //       score = score - opData.type.incorrect.mark;
      //     }
      //   })
      // }
      $scope.score = score;
    }

    function StartTimer() {
      console.log($scope.simData.TimeLimit);
      var date = new Date();
      var pushEvery = 2;
      //var _countDownDate = new Date(date.setTime(date.getTime() + ($scope.simData.TimeLimit.hours * 60 * 60 * 1000) + ($scope.simData.TimeLimit.mins * 60 * 1000) + ($scope.simData.TimeLimit.secs * 1000))).toString();
      //var countDownDate = new Date(_countDownDate).getTime();
      var countDownDate = new Date(date.setTime(date.getTime() + ($scope.simData.TimeLimit.hours * 60 * 60 * 1000) + ($scope.simData.TimeLimit.mins * 60 * 1000) + ($scope.simData.TimeLimit.secs * 1000)));

      Timeloop = $interval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        $scope.timer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        $scope.timer.mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        $scope.timer.secs = Math.floor((distance % (1000 * 60)) / 1000);
        if (distance < 0) {
          alert('Time Up');
          stopTimer();
          $scope.loadScoreCard();
        }
        if (pushEvery > 0) {
          pushEvery--;
        } else {
          pushUserSimData();
          pushEvery = 2;
        }
      }, 1000);
    }

    function stopTimer() {
      $interval.cancel(Timeloop);
      console.log('Timer Stopped');
    }

    function pushUserSimData() {
      // things to  update before pushing
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation = ($scope.currentQuestion != 'score') ? "Q" + $scope.currentQuestion : $scope.currentQuestion;
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].score = $scope.score;
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].timeTaken = $scope.timer;

      // and then push
      $http.post(baseURL + "./server/update-sim-data.php", {
          "username": $stateParams.user,
          "simulation": $scope.userSimData
        })
        .then(function (response) {
          if (response.data != "updated") {
            console.log(response.data);
            alert('Something went wrong! Please inform us using contact us page');
          }
        }).catch(function (err) {
          console.log(err);
        })
    }

    $scope.restSimulation = function () {
      $scope.userSimData[$scope.currentSimulation] = {};
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].attempted = true;
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].timeTaken = $scope.simData.TimeLimit;
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].currentLocation = "Q1";
      $scope.userSimData.simulationMetadata[$scope.currentSimulation].score = 0;
      $scope.score = 0;
      updateCurrentQuestionData(1);
      StartTimer();
    }

    $scope.goBackToSimSelect = function () {
      $state.go("sims.select");
    }
  }]);