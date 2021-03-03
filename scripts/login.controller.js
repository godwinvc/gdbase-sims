angular.module("gdbaseSims")
  .controller("loginController", ["$scope", "$http", "$state", "$interval", function ($scope, $http, $state, $interval) {
    var Timeloop = null;
    $scope.passRestTimer = {
      "hours": 0,
      "mins": 0,
      "secs": 0
    }
    var resetData = {};
    $scope.incorrectLogin = false;
    $scope.passValidEmail = true;
    $scope.passResetStage = 0;
    $scope.validNewPassword = 0;
    $scope.OTPState = "";
    $scope.loginHandler = function () {
      var loginData = {
        username: $scope.username,
        password: $scope.password
      }
      $http.post(apiURL + './server/login.php', loginData).then(function (response) {
        if (response.data !== 'ERROR') {
          localStorage.setItem("gdbaseToken", response.data.trim());
          if (location.pathname == "/client/") {
            window.open('https://www.gdbase.be/client/', '_self');
          } else {
            $state.go('sims.select', {
              user: $scope.username
            });
          }
        } else {
          $scope.incorrectLogin = true;
        }
      }).catch(function (err) {
        console.log(err);
      })
    }
    $scope.inputChangeHandler = function () {
      $scope.incorrectLogin = false;
    }
    $scope.forgotPassword = function () {
      $('#forgotPassModal').modal();
    }

    $scope.checkPassEmail = function () {
      if ($scope.passEmail != undefined) {
        if ($scope.passEmail.indexOf("@") < 0 || $scope.passEmail.indexOf(".") < 0) {
          $scope.passValidEmail = false;
          $scope.passResetStage = 0;
        } else {
          $scope.passValidEmail = true;
          $http.post(apiURL + "./server/pass-reset-email.php", $scope.passEmail)
            .then(function (response) {
              $scope.isPassUniqueEmail = "0";
              $scope.passValidEmail = true;
              if (response.data.response) {
                $scope.passResetStage = 1;
                var res = response.data.response;
                resetData = response.data;
                if (res == 'addedToWordpress') {
                  $scope.passResetStage = 2;

                } else if (res == 'addedToMyDB') {
                  $scope.passResetStage = 3;

                } else if (res == 'mailCode') {
                  $scope.passResetStage = 3;

                }
              } else {
                if (response.data == "Unknown") {
                  $scope.isPassUniqueEmail = "1";
                  $scope.passResetStage = 0;
                } else {
                  $scope.isPassUniqueEmail = "0";
                }
                if (response.data == "ERROR") {
                  alert("Something went wrong! Please let us know what happend from contact us page.");
                }
              }
            })
            .catch(function (err) {
              console.error(err);
            });
        }
      } else {
        $scope.passValidEmail = false;
        $scope.passResetStage = 0;
      }
    };

    function sendResetMail(firstname, user_email, username, activation_code) {
      localStorage.setItem('gdbaseOTP', generateOTP());
      var data = {
        firstname: firstname,
        email: user_email,
        activation_code: activation_code,
        username: username,
        otp: localStorage.getItem('gdbaseOTP')
      };
      $http.post(apiURL + "./server/send-password-reset-mail.php", data)
        .then(function (res) {
          $scope.passResetStage = 4;
          startTimer();
          if (activation_code) {
            $http.post(apiURL + "./server/send-activation-mail.php", data)
              .then(function (res2) {
                console.log("Both mails delivered to the given address");
              }).catch(function (err) {
                console.error(err);
              })
          }
        }).catch(function (err) {
          console.error(err);
        })

    }

    function generateOTP() {
      return Math.floor(Math.random() * 10000);
    }

    function startTimer() {
      var date = new Date();
      var countDownDate = new Date(date.setTime(date.getTime() + (0 * 60 * 60 * 1000) + (5 * 60 * 1000) + (0 * 1000)));

      Timeloop = $interval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        $scope.passRestTimer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        $scope.passRestTimer.mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        $scope.passRestTimer.secs = Math.floor((distance % (1000 * 60)) / 1000);
        if (distance < 1000) {
          $scope.OTPState = "expired";
          localStorage.removeItem('gdbaseOTP');
          stopTimer();
        }
      }, 1000);
    }

    $scope.passwordRest = function (stage) {
      if (stage == 2) {
        $scope.passResetStage = 1.5;
        sendResetMail(resetData.firstname, resetData.email, resetData.username ,resetData.activationCode);
      } else if (stage == 3) {
        $scope.passResetStage = 1.5;
        sendResetMail(resetData.firstname, resetData.email, resetData.username);
      } else if (stage == 4) {
        checkOTP();
      } else if (stage == 5) {
        $scope.passResetStage = 5.5;
        changePassword();
      }
    }

    function checkOTP() {
      if ($scope.passOTP == localStorage.getItem('gdbaseOTP')) {
        $scope.OTPState = 'approved';
        $scope.passResetStage = 5;
        stopTimer();
      } else {
        console.log("Incorrect ran");
        $scope.OTPState = 'incorrect';
      }
    }

    function stopTimer() {
      $interval.cancel(Timeloop);
      console.log('Timer Stopped');
    }
    $scope.validateNewPassword = function () {
      var srt = $scope.newPass;
      if (srt != undefined) {
        // if (
        //   srt.match(/^[a-zA-z]+$/) != null &&
        //   srt.match(/^[0-9]+$/) == null &&
        //   srt.length >= 6
        // ) {
        //   $scope.validNewPassword = 1; // if doesnt have numbers but length more than 6
        // } else if (
        //   srt.match(/^[a-zA-z]+$/) != null &&
        //   srt.match(/^[0-9]+$/) == null &&
        //   srt.length < 6
        // ) {
        //   $scope.validNewPassword = 1; // if doesnt have numbers and length less than 6
        // } else if (
        //   srt.match(/^[a-zA-z]+$/) == null &&
        //   srt.match(/^[0-9]+$/) != null &&
        //   srt.length >= 6
        // ) {
        //   $scope.validNewPassword = 2; // if doesnt have letter but length more than 6
        // } else if (
        //   srt.match(/^[a-zA-z]+$/) == null &&
        //   srt.match(/^[0-9]+$/) != null &&
        //   srt.length < 6
        // ) {
        //   $scope.validNewPassword = 2; // if doesnt have letter and length less than 6
        // } else if (
        //   srt.match(/^[a-zA-z]+$/) != null &&
        //   srt.match(/^[0-9]+$/) != null &&
        //   srt.length < 6
        // ) {
        //   $scope.validNewPassword = 3; // if not long enough
        // } else if (
        //   srt.match(/^[a-zA-z]+$/) == null &&
        //   srt.match(/^[0-9]+$/) == null &&
        //   srt.length < 6
        // ) {
        //   $scope.validNewPassword = 4; // if all above three fail
        // } else {
        //   $scope.validNewPassword = 5; // if all satisfied
        // }
        $scope.validNewPassword = 5; // if all satisfied
      } else {
        $scope.validNewPassword = 4;
      }
    };

    function changePassword() {
      var data = {
        email: resetData.email,
        password: $scope.newPass
      }
      $http.post(apiURL + "./server/change-pwd.php", data)
        .then(function (res) {
          if(res.data == "changedSucessfully"){
            $scope.passResetStage = 6;
          }else{
            alert("Something went wrong! Please close the pop up and try again. Or let us know from contact us page");
            $scope.passResetStage = 5;
          }
        }).catch(function (err) {
          console.error(err);
        })
    }
  }]);