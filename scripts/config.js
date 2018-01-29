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
    });
  }
]);