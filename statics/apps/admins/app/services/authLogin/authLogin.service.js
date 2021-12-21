define(['urlService', 'identityFactory', 'statusFactory'], function () {
    'use strict';

    angular.module('appAdmin').service('authLoginService', authLoginService);

    function authLoginService($http, $q, urlService, identityFactory, statusFactory) {
        this.login = login;
        this.isLoggedIn = isLoggedIn;
        this.logout = logout;

        function login(credentials) {
            return $http({
                url: urlService.AUTH_ADMIN,
                method: 'POST',
                data: credentials,
            })
                .then(function (response) {
                    return $q.resolve(response);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }

        function isLoggedIn() {
            return identityFactory
                .getNewWhoAmI()
                .then(function (response) {
                    return $q.resolve(response.status == statusFactory.OK);
                })
                .catch(function (error) {
                    return false;
                });
        }

        function logout() {
            return $http({
                url: urlService.AUTH_LOGOUT,
                method: 'POST',
            })
                .then(function (response) {
                    return $q.resolve(response.status == statusFactory.OK);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }
    }
});
