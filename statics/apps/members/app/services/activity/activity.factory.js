define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('activityFactory', activityFactory);

    function activityFactory($q, $http, urlService, humpsFactory, _) {
        var data = [];

        return {
            getWalletInfo: getWalletInfo,
            getWalletSummary: getWalletSummary,
            getActivitySummary: getActivitySummary,
        };

        function getWalletInfo(accountId, wallet) {
            return $http({
                url: urlService.GET_WALLET_INFO,
                method: 'POST',
                data: {
                    account_id: accountId,
                    wallet: wallet,
                },
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

        function getWalletSummary(accountId, wallet) {
            return $http({
                url: urlService.GET_WALLET_SUMMARY,
                method: 'GET',
                params: {
                    account_id: accountId,
                    wallet: wallet,
                },
            }).then(
                function (response) {
                    var responseData = [];
                    _.map(humpsFactory.camelizeKeys(response.data), function (wallet) {
                        responseData.push(wallet);
                    });
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function getActivitySummary(accountId) {
            return $http({
                url: urlService.GET_ACTIVITY_SUMMARY,
                method: 'POST',
                data: {
                    account_id: accountId,
                },
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
