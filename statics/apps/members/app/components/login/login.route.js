define(['loginModule'], function () {
    'use strict';

    angular.module('login.module').run(appRun);

    appRun.$inject = ['routerHelperProvider'];

    function appRun(routerHelperProvider) {
        routerHelperProvider.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'simple.login',
                config: {
                    templateUrl: '/statics/apps/members/app/components/login/login.tpl.html',
                    url: '/login',
                    data: {
                        pageTitle: 'One Creations | Member Login',
                    },
                    resolve: {
                        loadController: [
                            '$ocLazyLoad',
                            'directoryFactory',
                            function ($ocLazyLoad, DirectoryFactory) {
                                return $ocLazyLoad.load({
                                    files: [DirectoryFactory.COMPONENTS + '/login/login.controller.js'],
                                });
                            },
                        ],
                    },
                },
            },
        ];
    }
});
