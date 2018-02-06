angular.module("gdbaseSims")
  .controller("loginController", ["$scope", "$http", "$state", function ($scope, $http, $state) {
    $scope.incorrectLogin = false;
    $scope.loginHandler = function () {
      var loginData = {
        username: $scope.username,
        password: $scope.password
      }
      $scope.inputChangeHandler = function () {
        $scope.incorrectLogin = false;
      }
      $http.post(baseURL + './server/login.php', loginData).then(function (response) {
        if (response.data !== 'ERROR') {
          localStorage.setItem("gdbaseToken", response.data.trim());
          $state.go('sims.select', {
            user: $scope.username
          });
        } else {
          $scope.incorrectLogin = true;
        }
      }).catch(function (err) {
        console.log(err);
      })
    }
  }]);