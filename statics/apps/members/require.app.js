const appRoot = 'app/';
const components = 'app/components/';
const core = 'app/core/';
const shared = 'app/shared/';
const factories = 'app/factories/';
const services = 'app/services/';
const libs = 'assets/libs/';

require.config({
    baseUrl: '/statics/apps/members/',
    urlArgs: 'bust=' + new Date().getTime(),
    waitSeconds: 200,
    paths: {
        jquery: libs + 'jquery/jquery.min',
        popper: libs + 'bootstrap/js/popper.min',
        moment: libs + 'moment/moment',
        bootstrap: libs + 'bootstrap/js/bootstrap.bundle.min',
        angular: libs + 'angular/angular.min',
        ocLazyLoad: libs + 'ocLazyLoad/ocLazyLoad.require.min',
        ngIdle: libs + 'angular/angular-idle',
        ngRoute: libs + 'angular/angular-ui-router',
        ngSanitize: libs + 'angular/angular-sanitize.min',
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
        app: appRoot + 'app.module',
        // Core
        coreModule: core + 'core.module',
        routerModule: core + 'router/router.module',
        routerFactory: core + 'router/router.factory',
        routerProvider: core + 'router/router.provider',
        // Components
        componentsModule: components + 'components.module',
        loginModule: components + 'login/login.module',
        loginRoute: components + 'login/login.route',
        // Factories
        factoryModule: factories + 'factories.module',
        directoryFactory: factories + 'directory/directory.factory',
        identityFactory: factories + 'identity/identity.factory',
        urlFactory: factories + 'url/url.factory',
        // Services
        servicesModule: services + 'services.module',
        authLoginService: services + 'authLogin/authLogin.service',
        // Shared
        sharedModule: shared + 'shared.module',
        simpleRoute: shared + 'simple/simple.route',
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
        app: {
            deps: ['angular'],
        },
    },
});

require(['jquery', 'popper', 'moment', 'bootstrap'], function () {});

require(['app'], function () {
    angular.bootstrap(document, ['app']);
});
