define(['authLoginService', 'adsService'], function () {
    'use strict';

    angular.module('appMember').run(run);

    function run(
        $http,
        $rootScope,
        $location,
        $transitions,
        $state,
        authLoginService,
        statusFactory,
        adsService,
        toastr,
        $templateCache,
        DIRECTORY,
        blockUI
    ) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';

        $http({
            url: DIRECTORY.SHARED + '/templates/pagination/pagination.tpl.html',
            method: 'GET',
        })
            .then(function (response) {
                $templateCache.put('pagination.tpl.html', response.data);
            })
            .catch(function (error) {
                toastr.error('Unable to load Pagination Template');
            });

        $transitions.onStart({}, function (transition) {
            blockUI.start('Loading ...');
        });

        $transitions.onFinish({}, function (transition) {
            blockUI.stop();
        });

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
                        toastr.info('Resuming Session');
                        return transition.router.stateService.target('members.dashboard');
                    }
                });
            }
        });

        $transitions.onError({}, function (transition) {
            if (transition.error() && transition.error().detail) {
                if (transition.error().detail.status == statusFactory.UNAUTHORIZED) {
                    return transition.router.stateService.target('simple.login');
                }
            }
        });

        $transitions.onSuccess({}, function (transition) {
            $rootScope.pageTitle = transition.to().data.pageTitle;
        });
    }
});
