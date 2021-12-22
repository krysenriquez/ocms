define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('activityFactory', activityFactory);

    function activityFactory($q, $http, urlService, humpsFactory, _) {
        var data = [];

        return {
            ENTRY: 'ENTRY',
            PAYOUT: 'PAYOUT',
            DIRECT_REFERRAL: 'DIRECT_REFERRAL',
            PAIRING: 'PAIRING',
            LEADERSHIP: 'LEADERSHIP',
            UNLI_TEN: 'UNLI_TEN',
            UNILEVEL: 'UNILEVEL',
            WATCH_AND_EARN: 'WATCH_AND_EARN',
            CASHOUT: 'CASHOUT',
            getWalletSummary: getWalletSummary,
            getActivitySummary: getActivitySummary,
        };

        function getWalletSummary(wallet) {
            return $http({
                url: urlService.GET_WALLET_SUMMARY,
                method: 'GET',
                params: {
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

        function getActivitySummary(activityType, accountId) {
            return $http({
                url: urlService.GET_ACTIVITY_SUMMARY,
                method: 'GET',
                params: {
                    activity_type: activityType,
                    account_id: accountId,
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
    }
});
