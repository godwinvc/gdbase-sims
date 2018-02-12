angular.module("gdbaseSims")
  .controller("signupController", ["$scope", "$http", "$state", function ($scope, $http, $state) {
    var signupData = null;
    $scope.isUnique = null;
    $scope.validUsername = null;
    $scope.validEmail = null;
    $scope.validPassword = null;
    $scope.emailBlured = false;
    $scope.signupSuccess = false;
    $scope.signup = function () {
      $scope.signupSuccess = true;
      signupData = {
        firstname: $scope.firstName,
        lastname: $scope.lastName,
        email: $scope.email,
        mobile: $scope.mobile,
        username: $scope.username,
        password: $scope.password
      };
      $http.post(baseURL + "./server/signup.php", signupData)
        .then(function (response) {
          if (response.data.signUp) {
            console.log(response.data);
            $http.post(baseURL + "./server/send-activation-mail.php", {
                "firstname": $scope.firstName,
                "email": $scope.email,
                "activationCode": response.data.activationCode
              })
              .then(function (res) {
                if (res.data == "MailDelivered") {
                  localStorage.setItem("gdbaseToken", response.data.token.trim());
                  $state.go('sims.select', {
                    user: $scope.username
                  });
                } else {
                  console.log(res.data);
                  alert("Failed to Create Account! Please try again");
                  $scope.signupSuccess = false;
                }
              }).catch(function (err) {
                console.log(err);
              })
          } else {
            alert("Something went wrong! Please try again");
            console.log(response.data);
            $scope.signupSuccess = false;
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    };
    $scope.validateUsername = function () {
      $http.post(baseURL + "./server/username-avalibility.php", $scope.username)
        .then(function (response) {
          $scope.isUnique = response.data.trim();
        })
        .catch(function (err) {
          console.error(err);
        });
      if (!/^[a-zA-Z0-9-]*$/.test($scope.username)) {
        $scope.validUsername = false;
      } else {
        $scope.validUsername = true;
      }
    };
    $scope.validateEmail = function () {
      $http.post(baseURL + "./server/email-avalibility.php", $scope.email)
        .then(function (response) {
          $scope.isUniqueEmail = response.data.trim();
        })
        .catch(function (err) {
          console.error(err);
        });
      if ($scope.email != undefined) {
        if ($scope.email.indexOf("@") < 0 || $scope.email.indexOf(".") < 0) {
          $scope.validEmail = false;
        } else {
          $scope.validEmail = true;
        }
      } else {
        $scope.validEmail = false;
      }
      $scope.emailBlured = true;
    };
    $scope.validatePassword = function () {
      var srt = $scope.password;
      if (srt != undefined) {
        if (
          srt.match(/^[a-zA-z]+$/) != null &&
          srt.match(/^[0-9]+$/) == null &&
          srt.length >= 6
        ) {
          $scope.validPassword = 1; // if doesnt have numbers but length more than 6
        } else if (
          srt.match(/^[a-zA-z]+$/) != null &&
          srt.match(/^[0-9]+$/) == null &&
          srt.length < 6
        ) {
          $scope.validPassword = 1; // if doesnt have numbers and length less than 6
        } else if (
          srt.match(/^[a-zA-z]+$/) == null &&
          srt.match(/^[0-9]+$/) != null &&
          srt.length >= 6
        ) {
          $scope.validPassword = 2; // if doesnt have letter but length more than 6
        } else if (
          srt.match(/^[a-zA-z]+$/) == null &&
          srt.match(/^[0-9]+$/) != null &&
          srt.length < 6
        ) {
          $scope.validPassword = 2; // if doesnt have letter and length less than 6
        } else if (
          srt.match(/^[a-zA-z]+$/) != null &&
          srt.match(/^[0-9]+$/) != null &&
          srt.length < 6
        ) {
          $scope.validPassword = 3; // if not long enough
        } else if (
          srt.match(/^[a-zA-z]+$/) == null &&
          srt.match(/^[0-9]+$/) == null &&
          srt.length < 6
        ) {
          $scope.validPassword = 4; // if all above three fail
        } else {
          $scope.validPassword = 5; // if all satisfied
        }
      } else {
        $scope.validPassword = 4;
      }
    };
  }]);