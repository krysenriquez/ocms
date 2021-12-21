define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('walletFactory', walletFactory);

    function walletFactory($http, $q, urlService, humpsFactory) {
        return {
            verifyWalletCashout: verifyWalletCashout,
            getCashoutMethods: getCashoutMethods,
            requestCashout: requestCashout,
            getCashouts: getCashouts,
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

        function getCashoutMethods() {
            return $http({
                url: urlService.GET_PAYMENT_METHODS,
                method: 'POST',
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }

        function requestCashout(data) {
            console.log(humpsFactory.decamelizeKeys(data));
            return $http({
                url: urlService.REQUEST_CASHOUT,
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

        function getCashouts(accountId) {
            return $http({
                url: urlService.GET_CASHOUTS,
                method: 'GET',
                params: { account_id: accountId },
            }).then(
                function (response) {
                    var responseData = [];
                    _.map(humpsFactory.camelizeKeys(response.data), function (cashout) {
                        responseData.push(cashout);
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
