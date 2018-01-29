angular.module('gdbaseSims')
    .service('authService', ['$http', function ($http) {
        this.checkToken = function (username, token) {
            var data = {
                username: username,
                token: token
            };
            return $http.post('./endpoints/check-token.php', data)
                .then(function (response) {
                    return response.data.trim();
                }).catch(function (err) {
                    console.error(err);
                })
        }
    }]);