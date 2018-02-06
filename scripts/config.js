var runFunction = function ($rootScope, $transitions, authService, $state) {
  $transitions.onBefore({}, function (trans) {
    if (trans.$to().name != 'login' && trans.$to().name != 'signup') {
      $('section#content').css('height', '100%');
      if (localStorage.getItem('gdbaseToken') != null) {
        authService.checkToken(localStorage.getItem('gdbaseToken').split('|')[0], localStorage.getItem('gdbaseToken')).then(function (res) {
          if (res != 'good') {
            console.log('Token mismatch');
            localStorage.removeItem('gdbaseToken');
            $state.go('login');
          }
        })
      } else {
        console.log('Token missing');
        $state.go('login');
      }
    } else {
      $('section#content').css('height', '700px');
    }
    if (trans.$to().name == 'login') {
      if (localStorage.getItem('gdbaseToken') != null) {
        authService.checkToken(localStorage.getItem('gdbaseToken').split('|')[0], localStorage.getItem('gdbaseToken')).then(function (res) {
          if (res == 'good') {
            console.log('Token matched');
            $state.go('sims.select', {
              user: localStorage.getItem('gdbaseToken').split('|')[0]
            });
          } else {
            console.log('Token mismatch');
          }
        })
      }
    }
  });
  $transitions.onSuccess({}, function (trans) {
    $('[data-toggle="tooltip"]').tooltip();
  });
}
runFunction.$inject = ['$rootScope', '$transitions', 'authService', '$state'];
angular.module("gdbaseSims", ["ngSanitize", "ui.router", "ngAnimate"]).config([
  "$stateProvider",
  "$urlRouterProvider",
  "$locationProvider",
  function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/login");
    $stateProvider.state("login", {
      url: "/login",
      templateUrl: baseURL + "views/login.html",
      controller: "loginController"
    }).state("signup", {
      url: '/signup',
      templateUrl: baseURL + "views/signup.html",
      controller: "signupController"
    }).state("sims", {
      url: '/:user',
      templateUrl: baseURL + "views/sims.html",
      controller: "simsController"
    }).state("sims.select", {
      url: '/simulations',
      templateUrl: baseURL + "views/sim_select.html",
      controller: "simSelectController"
    }).state("sims.simulation", {
      url: '/:currentSimulation',
      templateUrl: baseURL + "views/simulation.html",
      controller: "simulationController"
    });
  }
]).run(runFunction);