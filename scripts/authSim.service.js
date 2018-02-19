angular.module("gdbaseSims").service("authSimService", [
  "$http",
  function($http) {
    this.checkSimPayment = function(username, sim) {
      return $http
        .post(baseURL + "./server/get-user-data.php", username)
        .then(function(response) {
          var simData = JSON.parse(response.data.simulation);
          return simData.simulationMetadata[sim].paid;
        })
        .catch(function(err) {
          console.error(err);
        });
    };
  }
]);
