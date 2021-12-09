define(['urlService'], function () {
    'use strict';

    angular.module('appMember').factory('userFactory', userFactory);

    function userFactory($http, $q, urlService) {
        return {
            getUserAccounts: getUserAccounts,
        };

        function getUserAccounts() {
            return $http({
                url: urlService.GET_USER_ACCOUNTS,
                method: 'GET',
            })
                .then(function (response) {
                    return $q.resolve(response);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }
    }
});
