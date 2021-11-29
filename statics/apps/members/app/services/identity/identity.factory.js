define(['urlService'], function () {
    'use strict';

    angular.module('appMember').factory('identityFactory', function ($http, urlService) {
        var promises = {};
        var whoAmI = {};
        return {
            getWhoAmI: getWhoAmI,
            getNewWhoAmI: getNewWhoAmI,
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

        function getWhoAmI() {
            if (angular.isUndefined(promises.getWhoAmI)) {
                promises.getWhoAmI = getNewWhoAmI();
            }
            console.log(promises);
            return promises.getWhoAmI;
        }
    });
});
