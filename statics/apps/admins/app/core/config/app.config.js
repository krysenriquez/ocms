define(['appAdmin', 'templateProvider'], function () {
    'use strict';

    angular.module('appAdmin').config([
        '$stateProvider',
        '$urlRouterProvider',
        '$ocLazyLoadProvider',
        '$locationProvider',
        'templateProvider',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider, templateProvider) {
            $ocLazyLoadProvider.config({
                jsLoader: requirejs,
                debug: true,
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false,
            });

            $stateProvider
                .state('simple', {
                    abstract: true,
                    secure: false,
                    url: '/oc-admin',
                    templateUrl: template.getShared('simple'),
                    resolve: {
                        loadCSS: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'Bootstrap',
                                        files: [DIRECTORY.CSS + '/bootstrap.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Bundle',
                                        files: [DIRECTORY.CSS + '/bundle.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Simple',
                                        files: [DIRECTORY.CSS + '/simple.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Font Awesome',
                                        files: [DIRECTORY.FONTS + '/font-awesome/css/fontawesome-all.css'],
                                    },
                                ]);
                            },
                        ],
                    },
                })
                .state('simple.login', {
                    secure: false,
                    url: '/login',
                    templateUrl: template.getComponent('login'),
                    data: {
                        pageTitle: 'One Creations | Login',
                    },
                    resolve: {
                        loadController: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load({
                                    files: [DIRECTORY.COMPONENTS + '/login/login.controller.js'],
                                });
                            },
                        ],
                    },
                })
                .state('admin', {
                    secure: true,
                    abstract: true,
                    url: '/oc-admin',
                    templateUrl: template.getShared('full'),
                    resolve: {
                        loadCSS: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'Bootstrap',
                                        files: [DIRECTORY.CSS + '/bootstrap.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Bundle',
                                        files: [DIRECTORY.CSS + '/bundle.css', DIRECTORY.CSS + '/breadcrumb.css'],
                                    },
                                    {
                                        serie: true,
                                        name: 'Font Awesome',
                                        files: [DIRECTORY.FONTS + '/font-awesome/css/fontawesome-all.css'],
                                    },
                                ]);
                            },
                        ],
                        loadDirective: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'Page Components',
                                        files: [
                                            DIRECTORY.COMPONENTS + '/navHeader/navHeader.directive.js',
                                            DIRECTORY.COMPONENTS + '/navHeader/collapseSidebar.directive.js',
                                            DIRECTORY.COMPONENTS + '/overlay/overlay.directive.js',
                                            DIRECTORY.COMPONENTS + '/navMenu/navMenu.directive.js',
                                            DIRECTORY.COMPONENTS + '/navFooter/navFooter.directive.js',
                                            DIRECTORY.COMPONENTS + '/content/content.directive.js',
                                            DIRECTORY.COMPONENTS + '/ads/ads.directive.js',
                                            '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                                        ],
                                    },
                                ]);
                            },
                        ],
                    },
                })
                .state('admin.dashboard', {
                    secure: true,
                    url: '/dashboard',
                    templateUrl: template.getComponent('dashboard'),
                    data: {
                        pageTitle: 'One Creations | My Dashboard',
                    },
                    resolve: {
                        loadCSS: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'Widgets CSS',
                                        files: [DIRECTORY.CSS + '/widgets/widgets.css'],
                                    },
                                ]);
                            },
                        ],
                        loadDirective: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'Widgets Directives',
                                        files: [
                                            DIRECTORY.COMPONENTS + '/widgets/activities/activities.directive.js',
                                            DIRECTORY.COMPONENTS + '/widgets/balance/balance.directive.js',
                                            DIRECTORY.COMPONENTS + '/widgets/transactions/transactions.directive.js',
                                            DIRECTORY.COMPONENTS + '/widgets/info/info.directive.js',
                                        ],
                                    },
                                ]);
                            },
                        ],
                    },
                });

            $urlRouterProvider.otherwise('/');
        },
    ]);
});
