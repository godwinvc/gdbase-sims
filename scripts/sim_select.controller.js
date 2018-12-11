angular.module("gdbaseSims").controller("simSelectController", [
  "$scope",
  "$state",
  function ($scope, $state) {
    $scope.simulations = {
      simulation2:{
        title: 'Simulation 2',
        productId: '694'
      },
      simulation3:{
        title: 'Simulation 3',
        productId: '965'
      },
      simulation4:{
        title: 'Simulation 4',
        productId: '696'
      },
      simulation5:{
        title: 'Simulation 5',
        productId: '700'
      },
      simulation6:{
        title: 'Simulation 6',
        productId: '701'
      },
    }
    $scope.selectedItem = {};
    var checkSimulationAccess = function (currentSimulationNum) {
      if (currentSimulationNum == "simulation1") {
        if ($scope.userSimData.accountActivated) {
          return true;
        } else {
          $("#activationModal").modal();
          return false;
        }
      } else {
        if ($scope.userSimData.simulationMetadata[currentSimulationNum].paid) {
          return true;
        } else {
          alert(
            "Something went wrong! Please let us know what happend using contact page."
          );
          return false;
        }
      }
    };
    $scope.openSimulation = function (currentSimulationNum) {
      if (checkSimulationAccess(currentSimulationNum)) {
        $state.go("sims.simulation", {
          currentSimulation: currentSimulationNum
        });
      }
    };
    $scope.lockedSims = function (currentSimulationNum) {
      // window.open('https://www.gdbase.be/product/' + currentSimulationNum + '/', '_self');
      $scope.selectedItem = $scope.simulations[currentSimulationNum];
      $('#products').modal({
        show: 'true'
      });
    }
    $scope.continueShopping = function (item) {
      $.post(location.href, { "quantity": "1", "add-to-cart": item.productId }, function (data) {
        console.log(item.title + "with ID: " + item.productId + "has been added to cart");
        // location.href = location.href;
        location.reload();
      })
    }
    $scope.goToCheckout = function (item) {
      $.post(location.href, { "quantity": "1", "add-to-cart": item.productId }, function (data) {
        console.log(item.title + "with ID: " + item.productId + "has been added to cart");
        location.href = "https://www.gdbase.be/panier/";
      });
    }
  }
]);