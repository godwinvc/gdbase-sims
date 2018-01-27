angular
  .module("gdbaseSims", ["ngSanitize", "ui.router", "ngAnimate"])
  .config([
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    function($stateProvider, $urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise(baseURL);
      $stateProvider.state("sims", {
        url: "",
        templateUrl: baseURL + "views/login.html",
        controller: "loginController"
      });
    }
  ]);
