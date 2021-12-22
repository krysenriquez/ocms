define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('cashoutFactory', cashoutFactory);

    function cashoutFactory($http, $q, urlService, humpsFactory) {
        return {
            getCashoutTax: getCashoutTax,
            getCashoutMethods: getCashoutMethods,
            requestCashout: requestCashout,
            getCashouts: getCashouts,
            getCashoutStatus: getCashoutStatus,
            saveCashoutStatus: saveCashoutStatus,
        };

        function getCashoutTax() {
            return $http({
                url: urlService.GET_CASHOUT_TAX,
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

        function getCashouts() {
            return $http({
                url: urlService.GET_CASHOUTS,
                method: 'GET',
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

        function getCashoutStatus() {
            return $http({
                url: urlService.GET_CASHOUT_STATUS,
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

        function saveCashoutStatus(cashoutNumber, cashoutStatus) {
            return $http({
                url: urlService.UPDATE_CASHOUT_STATUS,
                method: 'POST',
                data: {
                    cashout_id: cashoutNumber,
                    status: cashoutStatus,
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
