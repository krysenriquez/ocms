define([
    'appAdmin',
    'templateProvider',
    'cryptoProvider',
    'localStorageFactory',
    'userFactory',
    'identityFactory',
], function () {
    'use strict';

    angular.module('appAdmin').config(config);

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
            prefixStateName: 'admins.dashboard',
            includeAbstract: true,
            templateUrl: $templateProvider.getShared('breadcrumbs'),
        });

        $stateProvider
            .state('simple', {
                abstract: true,
                secure: false,
                url: '/oc-admin',
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
                template: '<login></login>',
                data: {
                    pageTitle: 'One Creations Admin | Login',
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
            .state('admins', {
                secure: true,
                abstract: true,
                url: '/oc-admin',
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
                                        DIRECTORY.SHARED + '/translate/translate.directive.js',
                                        DIRECTORY.SHARED + '/templates/tableSearch/tableSearch.directive.js',
                                        // '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                                    ],
                                },
                            ]);
                        },
                    ],
                    setUpUser: function (userFactory, localStorageFactory, identityFactory, toastr, _) {
                        var user = localStorageFactory.get('user');
                        if (user) {
                            userFactory.setUser(user);
                        } else {
                            identityFactory.getWhichUser().then(function (response) {
                                userFactory.setUser(response);
                            });
                        }
                    },
                },
            })
            .state('admins.dashboard', {
                secure: true,
                url: '/dashboard',
                templateUrl: $templateProvider.getShared('dashboard'),
                data: {
                    pageTitle: 'One Creations Admin | Dashboard',
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
                                        // DIRECTORY.COMPONENTS + '/widgets/activities/activities.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/top/earners/earners.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/top/flushout/flushout.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/top/salesMatch/salesMatch.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/expenses/expenses.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/summary/summary.directive.js',
                                        DIRECTORY.COMPONENTS + '/widgets/wallets/wallets.directive.js',
                                    ],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.wallets', {
                secure: true,
                url: '/wallets',
                template: '<wallets></wallets>',
                data: {
                    pageTitle: 'One Creations Admin | Wallets',
                },
                ncyBreadcrumb: {
                    label: 'Wallets',
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
                                    name: 'Wallets Directive',
                                    files: [DIRECTORY.COMPONENTS + '/wallets/wallets.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.cashouts', {
                secure: true,
                url: '/cash-outs',
                template: '<cashouts></cashouts>',
                data: {
                    pageTitle: 'One Creations Admin | Cash Outs',
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
                                    name: 'Cash Outs Directive',
                                    files: [DIRECTORY.COMPONENTS + '/cashouts/cashouts.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.members', {
                secure: true,
                url: '/members',
                template: '<members></members>',
                data: {
                    pageTitle: 'One Creations Admin | Members',
                },
                ncyBreadcrumb: {
                    label: 'Members',
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
                                    name: 'Members Directives',
                                    files: [DIRECTORY.COMPONENTS + '/members/members.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.genealogy', {
                secure: true,
                url: '/genealogy',
                template: '<binary-tree></binary-tree>',
                data: {
                    pageTitle: 'One Creations Admin | Genealogy',
                },
                ncyBreadcrumb: {
                    label: 'Members',
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
            .state('admins.salesmatch', {
                secure: true,
                url: '/sales-matches',
                template: '<sales-matches></sales-matches>',
                data: {
                    pageTitle: 'One Creations Admin | Sales Matches',
                },
                ncyBreadcrumb: {
                    label: 'Sales Matches',
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
                                    name: 'Sales Matches Directives',
                                    files: [DIRECTORY.COMPONENTS + '/salesMatches/salesMatches.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.flushout', {
                secure: true,
                url: '/flush-outs',
                template: '<flush-outs></flush-outs>',
                data: {
                    pageTitle: 'One Creations Admin | Flush Outs',
                },
                ncyBreadcrumb: {
                    label: 'Flush Outs',
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
                                    name: 'Flush Outs Directives',
                                    files: [DIRECTORY.COMPONENTS + '/flushOuts/flushOuts.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.referrals', {
                secure: true,
                url: '/referrals',
                template: '<referrals></referrals>',
                data: {
                    pageTitle: 'One Creations Admin | Referrals',
                },
                ncyBreadcrumb: {
                    label: 'Referrals',
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
                                    name: 'Referrals Directives',
                                    files: [DIRECTORY.COMPONENTS + '/referrals/referrals.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.unliten', {
                secure: true,
                url: '/unli-ten',
                template: '<unli-ten></unli-ten>',
                data: {
                    pageTitle: 'One Creations Admin | Unli Ten',
                },
                ncyBreadcrumb: {
                    label: 'Unli Ten',
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
                                    name: 'Unli Ten Directives',
                                    files: [DIRECTORY.COMPONENTS + '/unliTen/unliTen.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.codes', {
                secure: true,
                url: '/activation-codes',
                template: '<activation-codes></activation-codes>',
                data: {
                    pageTitle: 'One Creations Admin | Codes',
                },
                ncyBreadcrumb: {
                    label: 'Codes',
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
                                    name: 'Codes Directives',
                                    files: [DIRECTORY.COMPONENTS + '/activationCodes/activationCodes.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            })
            .state('admins.settings', {
                secure: true,
                url: '/system-settings',
                template: '<system-settings></system-settings>',
                data: {
                    pageTitle: 'One Creations Admin | System Settings',
                },
                ncyBreadcrumb: {
                    label: 'System Settings',
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
                                    name: 'Accordion CSS',
                                    files: [DIRECTORY.CSS + '/components/accordion.css'],
                                },
                                {
                                    serie: true,
                                    name: 'Switches CSS',
                                    files: [DIRECTORY.CSS + '/components/switches.css'],
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
                                    name: 'System Settings Directives',
                                    files: [DIRECTORY.COMPONENTS + '/systemSettings/systemSettings.directive.js'],
                                },
                            ]);
                        },
                    ],
                },
            });

        $urlRouterProvider.otherwise('/');
    }
});
