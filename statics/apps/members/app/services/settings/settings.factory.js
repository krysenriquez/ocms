define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('settingsFactory', settingsFactory);

    function settingsFactory($q, $http, urlService, humpsFactory, _) {
        var data = [];

        return {
            getWallets: getWallets,
            getWalletCashoutSchedule: getWalletCashoutSchedule,
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

        function getWalletCashoutSchedule(data) {
            return $http({
                url: urlService.GET_WALLET_CASHOUT_SCHEDULE,
                method: 'POST',
                data: humpsFactory.decamelizeKeys(data),
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
