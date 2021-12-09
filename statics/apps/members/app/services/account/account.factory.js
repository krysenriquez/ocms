define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('accountFactory', accountFactory);

    function accountFactory($q, $http, urlService, humpsFactory) {
        var data = [];

        return {
            getAccountId: getAccountId,
            setAccountId: setAccountId,
            getSelectedAccount: getSelectedAccount,
            setSelectedAccount: setSelectedAccount,
            getAccountGenealogy: getAccountGenealogy,
            getAccountCodes: getAccountCodes,
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
