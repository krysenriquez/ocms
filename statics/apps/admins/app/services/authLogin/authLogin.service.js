define(['urlService', 'identityFactory', 'statusFactory'], function () {
    'use strict';

    angular
        .module('appAdmin')
        .service(
            'authLoginService',
            function ($http, $location, $window, $timeout, $state, $q, urlService, identityFactory, statusFactory) {
                this.login = login;
                this.isLoggedIn = isLoggedIn;
                this.logout = logout;

                function login(credentials) {
                    return $http.post(urlService.AUTH_ADMIN, credentials).then(
                        function (response) {
                            return response.status == statusFactory.OK;
                        },
                        function (error) {
                            return false;
                        }
                    );
                }

                function isLoggedIn() {
                    return identityFactory.getNewWhoAmI().then(
                        function (response) {
                            return response.status == statusFactory.OK;
                        },
                        function (error) {
                            return false;
                        }
                    );
                }

                function logout() {
                    return $http.post(urlService.AUTH_LOGOUT).then(
                        function (response) {
                            return response.status == statusFactory.OK;
                        },
                        function (error) {
                            return false;
                        }
                    );
                }
            }
        );
});
