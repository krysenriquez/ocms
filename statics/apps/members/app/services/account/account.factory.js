define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('accountFactory', accountFactory);

    function accountFactory($q, $http, urlService, humpsFactory, localStorageFactory, _) {
        var data = [];

        return {
            getAccountId: getAccountId,
            setAccountId: setAccountId,
            getSelectedAccount: getSelectedAccount,
            setSelectedAccount: setSelectedAccount,
            getAccountGenealogy: getAccountGenealogy,
            getAccountCodes: getAccountCodes,
            createAccount: createAccount,
        };

        function getAccountId() {
            return data.accountId;
        }

        function setAccountId(accountId) {
            data.accountId = accountId;
        }

        function getSelectedAccount() {
            return data.selectedAccount;
        }

        function setSelectedAccount(account) {
            localStorageFactory.put('selectedAccount', account);
            data.selectedAccount = account;
        }

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

        function createAccount(data) {
            return $http({
                url: urlService.CREATE_ACCOUNT,
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
