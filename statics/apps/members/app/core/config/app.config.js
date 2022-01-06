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
            templateUrl: $templateProvider.getShared('breadcrumbs'),
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
                    loadDirective: [
                        '$ocLazyLoad',
                        'DIRECTORY',
                        function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'Page Components',
                                    files: [
                                        DIRECTORY.COMPONENTS + '/ads/ads.directive.js',
                                        // '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                                    ],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('simple.login', {
                secure: false,
                url: '/login',
                template: '<login></login>',
                data: {
                    pageTitle: 'One Creations | Login',
                },
                resolve: {
                    loadDirective: [
                        '$ocLazyLoad',
                        'DIRECTORY',
                        function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'Page Components',
                                    files: [DIRECTORY.COMPONENTS + '/login/login.directive.js'],
                                },
                            ]);
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
                                    name: 'Font Awesome JS',
                                    files: [DIRECTORY.PLUGINS + '/fontawesome/all.js'],
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
                templateUrl: $templateProvider.getShared('dashboard'),
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
                                    name: 'Table CSS',
                                    files: [DIRECTORY.CSS + '/components/tables.css'],
                                },
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
                                        DIRECTORY.COMPONENTS + '/widgets/summary/summary.directive.js',
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
                template: '<binary-tree></binary-tree>',
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
                template: '<ima-sdk-player></ima-sdk-player>',
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
                                    name: 'VideoJs CSS',
                                    files: [DIRECTORY.LIBS + '/videojs/video-js.css'],
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
            .state('members.codes', {
                secure: true,
                url: '/activation-codes',
                template: '<activation-codes></activation-codes>',
                data: {
                    pageTitle: 'One Creations | Activation Codes',
                },
                ncyBreadcrumb: {
                    label: 'Activation Codes',
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
                                    name: 'Activation Codes Directive',
                                    files: [DIRECTORY.COMPONENTS + '/activationCodes/activationCodes.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('members.cashout', {
                secure: true,
                url: '/cashout',
                template: '<cashouts></cashouts>',
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
            })
            .state('members.profile', {
                secure: true,
                url: '/profile',
                template: '<profile></profile>',
                data: {
                    pageTitle: 'One Creations | My Profile',
                },
                ncyBreadcrumb: {
                    label: 'Profile',
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
                                        DIRECTORY.CSS + '/components/widgets.css',
                                        DIRECTORY.CSS + '/components/profile.css',
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
                                    name: 'Profile Directives',
                                    files: [
                                        DIRECTORY.COMPONENTS + '/profile/profile.directive.js',
                                        DIRECTORY.COMPONENTS + '/profile/binary/binary.directive.js',
                                    ],
                                },
                            ]);
                        },
                    ],
                },
            });

        $urlRouterProvider.otherwise('/');
    }
});
