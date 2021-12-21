define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('accountFactory', accountFactory);

    function accountFactory($q, $http, urlService, humpsFactory, localStorageFactory, _) {
        var data = [];

        return {
            PAIRING: 'PAIRING',
            SALES_MATCH: 'SALES_MATCH',
            FLUSHED_OUT: 'FLUSHED_OUT',
            getAccountGenealogy: getAccountGenealogy,
            getBinary: getBinary,
            getAccountCodes: getAccountCodes,
            getMembers: getMembers,
            getUnliTen: getUnliTen,
        };

        function getAccountGenealogy(accountId) {
            return $http({
                url: urlService.GENEALOGY,
                method: 'GET',
                params: { account_id: accountId },
            }).then(
                function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data[0]);
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function getMembers() {
            return $http({
                url: urlService.GET_MEMBERS,
                method: 'GET',
            }).then(
                function (response) {
                    var responseData = [];
                    _.map(humpsFactory.camelizeKeys(response.data), function (member) {
                        responseData.push(member);
                    });
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function getBinary(binaryType) {
            return $http({
                url: urlService.GET_BINARY,
                method: 'GET',
                params: { binary_type: binaryType },
            }).then(
                function (response) {
                    var responseData = [];
                    _.map(humpsFactory.camelizeKeys(response.data), function (binary) {
                        responseData.push(binary);
                    });
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function getUnliTen() {
            return $http({
                url: urlService.GET_UNLI_TEN,
                method: 'GET',
            }).then(
                function (response) {
                    var responseData = [];
                    _.map(
                        _.orderBy(humpsFactory.camelizeKeys(response.data), ['referrals'], ['desc']),
                        function (binary) {
                            responseData.push(binary);
                        }
                    );

                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function getAccountCodes(accountId) {
            return $http({
                url: urlService.GET_ACCOUNT_CODES,
                method: 'GET',
                params: { account_id: accountId },
            }).then(
                function (response) {
                    var responseData = [];
                    _.map(humpsFactory.camelizeKeys(response.data), function (code) {
                        responseData.push(code);
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
