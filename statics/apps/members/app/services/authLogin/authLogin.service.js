define(['urlService', 'identityFactory', 'statusService'], function () {
    'use strict';

    angular
        .module('appMember')
        .service(
            'authLoginService',
            function ($http, $location, $window, $timeout, $state, $q, urlService, identityFactory, statusService) {
                this.login = login;
                this.isLoggedIn = isLoggedIn;
                this.logout = logout;

                function login(credentials) {
                    return $http.post(urlService.AUTH_MEMBER, credentials).then(
                        function (response) {
                            return response.status == statusService.OK;
                            // return appFactory.getCurrentUserInfo().then(function (data) {
                            //     if (data.accountUser.length > 0) {
                            //         var selectedMemberAccount = {
                            //             accountId: data.accountUser[0].accountId,
                            //         };
                            //         localStorage.selectedMemberAccount = JSON.stringify(selectedMemberAccount);
                            //         defer.resolve(true);
                            //     } else {
                            //         defer.resolve(false);
                            //     }
                            //     return defer.promise;
                            // });
                        },
                        function (error) {
                            return false;
                        }
                    );
                }

                function isLoggedIn() {
                    return identityFactory.getNewWhoAmI().then(
                        function (response) {
                            return response.status == statusService.OK;
                        },
                        function (error) {
                            return false;
                        }
                    );
                }

                function logout() {
                    return $http.post(urlService.AUTH_LOGOUT).then(
                        function (response) {
                            return response.status == statusService.OK;
                        },
                        function (error) {
                            return false;
                        }
                    );
                }
            }
        );
});
