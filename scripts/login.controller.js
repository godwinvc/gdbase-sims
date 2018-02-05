angular.module("gdbaseSims").controller("loginController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $scope.incorrectLogin = false;
    $scope.loginHandler = function () {
      var loginData = {
        username: $scope.username,
        password: $scope.password
      }
      $scope.inputChangeHandler = function () {
        $scope.incorrectLogin = false;
      }
      $http.post('./server/login.php', loginData).then(function (res) {
        if (res.data !== 'ERROR') {
          $scope
        } else {
          $scope.incorrectLogin = true;
        }
      }).catch(function (err) {
        console.log(err);
      })
    }
  }
]);