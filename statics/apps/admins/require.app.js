const appRoot = 'app/';
const components = 'app/components/';
const core = 'app/core/';
const shared = 'app/shared/';
const services = 'app/services/';
const libs = 'assets/libs/';

require.config({
    baseUrl: '/statics/apps/admins/',
    urlArgs: 'bust=' + new Date().getTime(),
    waitSeconds: 200,
    paths: {
        jquery: libs + 'jquery/jquery.min',
        popper: libs + 'bootstrap/js/popper.min',
        moment: libs + 'moment/moment',
        bootstrap: libs + 'bootstrap/js/bootstrap.bundle.min',
        lodash: libs + 'lodash/lodash',
        angular: libs + 'angular/angular.min',
        ocLazyLoad: libs + 'ocLazyLoad/ocLazyLoad.require.min',
        ngIdle: libs + 'angular/angular-idle',
        ngRoute: libs + 'angular/angular-ui-router',
        ngSanitize: libs + 'angular/angular-sanitize.min',
        ngLodash: libs + 'angular/angular-lodash',
        raphael: libs + 'treant/raphael',
        // UI Libs
        ngAnimate: libs + 'angular/angular-animate.min',
        ngBootstrap: libs + 'angular/angular-ui-bootstrap-tpls.min',
        ngBreadcrumb: libs + 'ngBreadcrumb/angular-breadcrumb.min',
        ngLoadingbar: libs + 'angular/angular-loading-bar.min',
        ngTable: libs + 'ngTable/ng-table',
        ngToastr: libs + 'toastr/dist/js/angular-toastr.tpls.min',
        ngSweetalert: libs + 'sweetalert/SweetAlert',
        sweetalert: libs + 'sweetalert/sweetalert.min',
        ngBlock: libs + 'ngBlock/angular-block-ui.min',
        // Custom Scripts
        appAdmin: appRoot + 'app.module',
        // Core
        appConfig: core + 'config/app.config',
        appRun: core + 'run/app.run',
        appConstant: core + 'constant/app.constant',
        // Factories, Providers
        accountFactory: services + 'account/account.factory',
        authLoginService: services + 'authLogin/authLogin.service',
        humpsFactory: services + 'humps/humps.factory',
        identityFactory: services + 'identity/identity.factory',
        statusService: services + 'status/status.service',
        templateProvider: services + 'template/template.provider',
        urlService: services + 'url/url.service',
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery'],
        },
        ngAnimate: {
            deps: ['angular'],
        },
        ngBootstrap: {
            deps: ['angular', 'ngAnimate'],
        },
        ngBreadcrumb: {
            deps: ['angular'],
        },
        ngRoute: {
            deps: ['angular'],
        },
        ngSanitize: {
            deps: ['angular'],
        },
        ngLodash: {
            deps: ['lodash', 'angular'],
        },
        ocLazyLoad: {
            deps: ['angular'],
        },
        ngIdle: {
            deps: ['angular'],
        },
        ngBlock: {
            deps: ['angular'],
        },
        ngLoadingbar: {
            deps: ['angular'],
        },
        ngToastr: {
            deps: ['angular'],
        },
        ngTable: {
            deps: ['angular'],
        },
        ngSweetalert: {
            deps: ['angular', 'sweetalert'],
        },
        vgModule: {
            deps: ['angular'],
        },
        vgControls: {
            deps: ['angular'],
        },
        vgOverlayPlay: {
            deps: ['angular'],
        },
        vgPoster: {
            deps: ['angular'],
        },
        vgImaAds: {
            deps: ['angular'],
        },
        appAdmin: {
            deps: ['jquery', 'angular', 'ngAnimate', 'ngSanitize', 'ngRoute', 'ngLoadingbar', 'ngLodash', 'ocLazyLoad'],
        },
        appConfig: {
            deps: ['appAdmin'],
        },
        appRun: {
            deps: ['appAdmin'],
        },
        raphael: {
            exports: 'Raphael',
        },
    },
});

require(['jquery', 'popper', 'moment', 'bootstrap'], function () {});

require(['appAdmin', 'appConfig', 'appRun', 'appConstant'], function () {
    angular.bootstrap(document, ['appAdmin']);
});
