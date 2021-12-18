define([
    'appMember',
    'templateProvider',
    'cryptoProvider',
    'localStorageFactory',
    'userFactory',
    'accountFactory',
], function () {
    'use strict';

    angular.module('appMember').config(config);

    function config(
        $stateProvider,
        $urlRouterProvider,
        $ocLazyLoadProvider,
        $locationProvider,
        $templateProvider,
        $breadcrumbProvider
    ) {
        $ocLazyLoadProvider.config({
            jsLoader: requirejs,
            debug: false,
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
                templateUrl: $templateProvider.getShared('simple'),
                resolve: {
                    loadCSS: [
                        '$ocLazyLoad',
                        'DIRECTORY',
                        function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'Bootstrap CSS',
                                    files: [DIRECTORY.CSS + '/bootstrap.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Bundle CSS',
                                    files: [DIRECTORY.CSS + '/bundle.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Simple CSS',
                                    files: [DIRECTORY.CSS + '/simple.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Font Awesome CSS',
                                    files: [DIRECTORY.FONTS + '/font-awesome/css/fontawesome-all.css'],
                                },
                                {
                                    serie: true,
                                    name: 'ngBlock CSS',
                                    files: [DIRECTORY.LIBS + '/ngBlock/angular-block-ui.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Toastr CSS',
                                    files: [DIRECTORY.LIBS + '/toastr/dist/css/angular-toastr.min.css'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('simple.login', {
                secure: false,
                url: '/login',
                templateUrl: $templateProvider.getComponent('login'),
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
                templateUrl: $templateProvider.getShared('full'),
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
                                    name: 'Bootstrap CSS',
                                    files: [DIRECTORY.CSS + '/bootstrap.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Bundle CSS',
                                    files: [DIRECTORY.CSS + '/bundle.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Font Awesome',
                                    files: [DIRECTORY.FONTS + '/font-awesome/css/fontawesome-all.css'],
                                },
                                {
                                    serie: true,
                                    name: 'ngBlock CSS',
                                    files: [DIRECTORY.LIBS + '/ngBlock/angular-block-ui.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Toastr CSS',
                                    files: [DIRECTORY.LIBS + '/toastr/dist/css/angular-toastr.min.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Breadcrumb CSS',
                                    files: [DIRECTORY.CSS + '/components/breadcrumb.css'],
                                },
                                {
                                    serie: true,
                                    name: 'ngTable CSS',
                                    files: [DIRECTORY.LIBS + '/ngTable/ng-table.min.css'],
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
                                        DIRECTORY.COMPONENTS + '/navMenu/navMenu.directive.js',
                                        DIRECTORY.COMPONENTS + '/navFooter/navFooter.directive.js',
                                        DIRECTORY.COMPONENTS + '/overlay/overlay.directive.js',
                                        DIRECTORY.COMPONENTS + '/ads/ads.directive.js',
                                        DIRECTORY.SHARED + '/translate/translate.directive.js',
                                        // '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                                    ],
                                },
                            ]);
                        },
                    ],
                    setUpSelectedAccount: function (userFactory, localStorageFactory, accountFactory, toastr, _) {
                        var selectedAccount = localStorageFactory.get('selectedAccount');
                        if (selectedAccount) {
                            accountFactory.setSelectedAccount(selectedAccount);
                        } else {
                            toastr.info('No Selected Account. Defaulting to Primary Account.');
                            userFactory.getUserAccounts().then(function (response) {
                                accountFactory.setSelectedAccount(_.head(response));
                            });
                        }
                    },
                },
            })
            .state('members.dashboard', {
                secure: true,
                url: '/dashboard',
                templateUrl: $templateProvider.getComponent('dashboard'),
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
                                    files: [DIRECTORY.CSS + '/components/widgets.css'],
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
                                        DIRECTORY.COMPONENTS + '/widgets/transactions/transactions.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/info/info.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/wallets/wallets.directive.js',
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
                templateUrl: $templateProvider.getComponent('genealogy'),
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
                                    files: [DIRECTORY.CSS + '/components/genealogy.css'],
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
                                    files: [DIRECTORY.COMPONENTS + '/binaryTree/binaryTree.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('members.earn', {
                secure: true,
                url: '/earn',
                templateUrl: $templateProvider.getComponent('earn'),
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
                                    name: 'Widgets CSS',
                                    files: [DIRECTORY.CSS + '/components/widgets.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Videogular CSS',
                                    files: [DIRECTORY.CSS + '/components/videogular.css'],
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
                templateUrl: $templateProvider.getComponent('link'),
                data: {
                    pageTitle: 'One Creations | Referral Links',
                },
                ncyBreadcrumb: {
                    label: 'Referral Links',
                },
                resolve: {
                    loadCSS: [
                        '$ocLazyLoad',
                        'DIRECTORY',
                        function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'Table CSS',
                                    files: [DIRECTORY.CSS + '/components/tables.css'],
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
            })
            .state('members.cashout', {
                secure: true,
                url: '/cashout',
                templateUrl: $templateProvider.getComponent('cashout'),
                data: {
                    pageTitle: 'One Creations | Cashouts',
                },
                ncyBreadcrumb: {
                    label: 'Cash Outs',
                },
                resolve: {
                    loadCSS: [
                        '$ocLazyLoad',
                        'DIRECTORY',
                        function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'Table CSS',
                                    files: [DIRECTORY.CSS + '/components/tables.css'],
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
                                    files: [DIRECTORY.COMPONENTS + '/cashouts/cashouts.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            });

        $urlRouterProvider.otherwise('/');
    }
});
