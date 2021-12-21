define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('settingsFactory', settingsFactory);

    function settingsFactory($q, $http, urlService, humpsFactory, _) {
        var data = [];

        return {
            getWallets: getWallets,
        };

        function getWallets() {
            return $http({
                url: urlService.GET_WALLETS,
                method: 'POST',
            }).then(
                function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data);
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }
    }
});
