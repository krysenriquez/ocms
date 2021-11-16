define(['routerProvider'], function () {
    'use strict';

    angular.module('simple.route', ['router.module']).run(appRun);

    appRun.$inject = ['routerHelperProvider'];

    function appRun(routerHelperProvider) {
        routerHelperProvider.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'simple',
                abstract: true,
                config: {
                    templateUrl: '/statics/apps/members/app/shared/simple/simple.tpl.html',
                    url: '/member',
                    resolve: {
                        loadCSS: [
                            '$ocLazyLoad',
                            'directoryFactory',
                            function ($ocLazyLoad, DirectoryFactory) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'Bootstrap',
                                        files: [DirectoryFactory.CSS + '/bootstrap.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Bundle',
                                        files: [DirectoryFactory.CSS + '/bundle.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Simple',
                                        files: [DirectoryFactory.CSS + '/simple.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Font Awesome',
                                        files: [DirectoryFactory.FONTS + '/font-awesome/css/fontawesome-all.css'],
                                    },
                                ]);
                            },
                        ],
                    },
                },
            },
        ];
    }
});
