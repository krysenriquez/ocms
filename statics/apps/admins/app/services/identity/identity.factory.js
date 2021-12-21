define(['urlService'], function () {
    'use strict';

    angular.module('appAdmin').factory('identityFactory', identityFactory);

    function identityFactory($http, urlService, humpsFactory) {
        var promises = {};
        var whoAmI = {};
        return {
            getWhoAmI: getWhoAmI,
            getNewWhoAmI: getNewWhoAmI,
            getWhichUser: getWhichUser,
        };

        function getNewWhoAmI() {
            return $http({
                url: urlService.AUTH_WHOAMI,
                method: 'POST',
            }).then(function (data) {
                angular.forEach(data, function (value, key) {
                    whoAmI[key] = value;
                });
                return whoAmI;
            });
        }

        function getWhichUser() {
            return $http({
                url: urlService.AUTH_WHICH_USER,
                method: 'POST',
            }).then(function (response) {
                return humpsFactory.camelizeKeys(response.data);
            });
        }

        function getWhoAmI() {
            if (angular.isUndefined(promises.getWhoAmI)) {
                promises.getWhoAmI = getNewWhoAmI();
            }
            return promises.getWhoAmI;
        }
    }
});
