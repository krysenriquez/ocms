define(['authLoginService', ''], function () {
    'use strict';

    angular.module('appAdmin').run([
        '$http',
        '$rootScope',
        '$location',
        '$transitions',
        '$state',
        'authLoginService',
        'statusService',
        function ($http, $rootScope, $location, $transitions, $state, authLoginService, statusService) {
            $http.defaults.xsrfHeaderName = 'X-CSRFToken';
            $http.defaults.xsrfCookieName = 'csrftoken';

            $transitions.onBefore({}, function (transition) {
                if (transition.to().secure) {
                    return authLoginService.isLoggedIn().then(function (response) {
                        if (!response) {
                            return transition.router.stateService.target('simple.login');
                        }
                    });
                }
                if (!transition.to().secure) {
                    return authLoginService.isLoggedIn().then(function (response) {
                        if (response) {
                            return transition.router.stateService.target('admin.dashboard');
                        }
                    });
                }
            });

            $transitions.onError({}, function (transition) {
                if (transition.error() && transition.error().detail) {
                    if (transition.error().detail.status == statusService.UNAUTHORIZED) {
                        return transition.router.stateService.target('simple.login');
                    }
                }
            });

            $transitions.onSuccess({}, function (transition) {
                $rootScope.pageTitle = transition.to().data.pageTitle;
            });
        },
    ]);
});
