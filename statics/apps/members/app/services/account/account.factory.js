define([], function () {
    'use strict';

    angular.module('appMember').factory('accountFactory', function () {
        var data = [];

        return {
            getAccountId: getAccountId,
            setAccountId: setAccountId,
        };

        function getAccountId() {
            return data.accountId;
        }

        function setAccountId(accountId) {
            data.accountId = accountId;
        }
    });
});
