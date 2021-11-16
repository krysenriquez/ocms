define(['urlFactory'], function () {
    'use strict';

    angular.module('identity.module', ['url.module']).factory('identityFactory', IdentityFactory);

    IdentityFactory.$inject = ['urlFactory'];

    function IdentityFactory($http, UrlFactory) {
        var promises = [];
        return {
            getWhoAmI: getWhoAmI,
        };

        function getNewWhoAmI() {
            var whoAmI = {};
            return $http({
                url: UrlFactory.WHOAMI,
                method: 'POST',
            }).then(function (data) {
                angular.foreach(data, function (value, key) {
                    whoAmI[key] = value;
                });
                return whoAmI;
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
