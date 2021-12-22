define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('walletFactory', walletFactory);

    function walletFactory($http, $q, urlService, humpsFactory) {
        return {
            verifyWalletCashout: verifyWalletCashout,
        };

        function verifyWalletCashout(accountId, wallet) {
            return $http({
                url: urlService.VERIFY_WALLET_CASHOUT,
                method: 'POST',
                data: {
                    account_id: accountId,
                    wallet: wallet,
                },
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }
    }
});
