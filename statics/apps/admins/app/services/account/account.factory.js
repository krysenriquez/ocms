define([], function () {
    'use strict';

    angular.module('appAdmin').factory('accountFactory', function () {
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
