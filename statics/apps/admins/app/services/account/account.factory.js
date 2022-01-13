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
            getReferrals: getReferrals,
            getUnliTen: getUnliTen,
            verifyCode: verifyCode,
            generateCode: generateCode,
            getTopBinary: getTopBinary,
            getTopEarners: getTopEarners,
            getTopWatchers: getTopWatchers,
        };

        function getAccountGenealogy(accountNumber) {
            return $http({
                url: urlService.GENEALOGY,
                method: 'GET',
                params: { account_number: accountNumber },
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

        function getReferrals() {
            return $http({
                url: urlService.GET_REFERRALS,
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

        function getTopBinary(binaryType) {
            return $http({
                url: urlService.GET_TOP_BINARY,
                method: 'GET',
                params: { binary_type: binaryType },
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

        function getTopEarners() {
            return $http({
                url: urlService.GET_TOP_EARNERS,
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

        function getTopWatchers() {
            return $http({
                url: urlService.GET_TOP_WATCHERS,
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

        function getAccountCodes() {
            return $http({
                url: urlService.GET_ACCOUNT_CODES,
                method: 'GET',
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

        function verifyCode(accountId) {
            return $http({
                url: urlService.VERIFY_ACCOUNT,
                method: 'POST',
                data: {
                    account_id: accountId,
                },
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }

        function generateCode(data) {
            return $http({
                url: urlService.GENERATE_CODE,
                method: 'POST',
                data: humpsFactory.decamelizeKeys(data),
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }
    }
});
