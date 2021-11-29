define(['appMember', 'templateProvider'], function () {
    'use strict';

    angular.module('appMember').config([
        '$stateProvider',
        '$urlRouterProvider',
        '$ocLazyLoadProvider',
        '$locationProvider',
        'templateProvider',
        '$breadcrumbProvider',
        function (
            $stateProvider,
            $urlRouterProvider,
            $ocLazyLoadProvider,
            $locationProvider,
            templateProvider,
            $breadcrumbProvider
        ) {
            $ocLazyLoadProvider.config({
                jsLoader: requirejs,
                debug: true,
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false,
            });

            $breadcrumbProvider.setOptions({
                prefixStateName: 'members.dashboard',
                includeAbstract: true,
                templateUrl: '/statics/apps/members/app/components/breadcrumbs/breadcrumbs.tpl.html',
            });

            $stateProvider
                .state('simple', {
                    abstract: true,
                    secure: false,
                    url: '/member',
                    templateUrl: templateProvider.getShared('simple'),
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
                    templateUrl: templateProvider.getComponent('login'),
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
                .state('members', {
                    secure: true,
                    abstract: true,
                    url: '/member',
                    templateUrl: templateProvider.getShared('full'),
                    ncyBreadcrumb: {
                        label: 'Root',
                        skip: true,
                    },
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
                                            DIRECTORY.COMPONENTS + '/ads/ads.directive.js',
                                            '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                                        ],
                                    },
                                ]);
                            },
                        ],
                    },
                })
                .state('members.dashboard', {
                    secure: true,
                    url: '/dashboard',
                    templateUrl: templateProvider.getComponent('dashboard'),
                    data: {
                        pageTitle: 'One Creations | My Dashboard',
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard',
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
                })
                .state('members.genealogy', {
                    secure: true,
                    url: '/genealogy',
                    templateUrl: templateProvider.getComponent('genealogy'),
                    data: {
                        pageTitle: 'One Creations | Genealogy',
                    },
                    ncyBreadcrumb: {
                        label: 'Genealogy',
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
                                        files: [
                                            DIRECTORY.CSS + '/widgets/widgets.css',
                                            DIRECTORY.LIBS + '/treant/Treant.css',
                                            DIRECTORY.CSS + '/avatar.css',
                                        ],
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
                                            DIRECTORY.COMPONENTS + '/binaryTree/binaryTree.directive.js',
                                            DIRECTORY.LIBS + '/treant/Treant.js',
                                        ],
                                    },
                                ]);
                            },
                        ],
                    },
                })
                .state('members.earn', {
                    secure: true,
                    url: '/earn',
                    templateUrl: templateProvider.getComponent('earn'),
                    data: {
                        pageTitle: 'One Creations | Watch and Earn',
                    },
                    ncyBreadcrumb: {
                        label: 'Watch and Earn',
                    },
                    resolve: {
                        loadCSS: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'Videogular CSS',
                                        files: [
                                            DIRECTORY.CSS + '/videogular.css',
                                            DIRECTORY.CSS + '/widgets/widgets.css',
                                        ],
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
                                        files: [DIRECTORY.COMPONENTS + '/imaSdkPlayer/imaSdkPlayer.directive.js'],
                                    },
                                ]);
                            },
                        ],
                    },
                })
                .state('members.link', {
                    secure: true,
                    url: '/referral-link',
                    templateUrl: templateProvider.getComponent('link'),
                    data: {
                        pageTitle: 'One Creations | Referral Links',
                    },
                    ncyBreadcrumb: {
                        label: 'Referral Link',
                    },
                    resolve: {
                        loadCSS: [
                            '$ocLazyLoad',
                            'DIRECTORY',
                            function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: '',
                                        files: [],
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
                                        name: 'Referral Link Directive',
                                        files: [DIRECTORY.COMPONENTS + '/referralLinks/referralLinks.directive.js'],
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
