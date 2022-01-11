const appRoot = 'app/';
const components = 'app/components/';
const core = 'app/core/';
const shared = 'app/shared/';
const services = 'app/services/';
const libs = 'assets/libs/';

require.config({
    baseUrl: '/statics/apps/members/',
    urlArgs: 'bust=' + new Date().getTime(),
    waitSeconds: 200,
    paths: {
        jquery: libs + 'jquery/jquery.min',
        crypto: libs + 'crypto/crypto',
        popper: libs + 'bootstrap/js/popper.min',
        moment: libs + 'moment/moment.min',
        bootstrap: libs + 'bootstrap/js/bootstrap.bundle.min',
        lodash: libs + 'lodash/lodash.min',
        angular: libs + 'angular/angular.min',
        ocLazyLoad: libs + 'ocLazyLoad/ocLazyLoad.require.min',
        ngIdle: libs + 'angular/angular-idle',
        ngRoute: libs + 'angular/angular-ui-router.min',
        ngSanitize: libs + 'angular/angular-sanitize.min',
        ngLodash: libs + 'angular/angular-lodash',
        // UI Libs
        ngAnimate: libs + 'angular/angular-animate.min',
        ngBootstrap: libs + 'angular/angular-ui-bootstrap.min',
        ngBreadcrumb: libs + 'ngBreadcrumb/angular-breadcrumb.min',
        ngLoadingbar: libs + 'angular/angular-loading-bar.min',
        ngTable: libs + 'ngTable/ng-table.min',
        ngBlock: libs + 'ngBlock/angular-block-ui.min',
        ngToastr: libs + 'toastr/dist/js/angular-toastr.tpls.min',
        ngSweetalert: libs + 'sweetalert/SweetAlert',
        sweetalert: libs + 'sweetalert/sweetalert.min',
        orgChart: libs + 'orgChart/orgChart',
        // Video JS
        videojs: libs + 'videojs/video.min',
        videojsAds: libs + 'videojs/videojs.ads.min',
        videojsIma: libs + 'videojs/videojs.ima.min',
        videojsYoutube: libs + 'videojs/Youtube.min',
        // Custom Scripts
        appMember: appRoot + 'app.module',
        // Core
        appConfig: core + 'config/app.config',
        appRun: core + 'run/app.run',
        appConstant: core + 'constant/app.constant',
        // Factories, Services
        accountFactory: services + 'account/account.factory',
        activityFactory: services + 'activity/activity.factory',
        adsService: services + 'ads/ads.service',
        authLoginService: services + 'authLogin/authLogin.service',
        cashoutFactory: services + 'cashout/cashout.factory',
        codesFactory: services + 'codes/codes.factory',
        humpsFactory: services + 'humps/humps.factory',
        identityFactory: services + 'identity/identity.factory',
        localStorageFactory: services + 'localStorage/localStorage.factory',
        statusFactory: services + 'status/status.factory',
        settingsFactory: services + 'settings/settings.factory',
        urlService: services + 'url/url.service',
        userFactory: services + 'user/user.factory',
        verifyFactory: services + 'verify/verify.factory',
        walletFactory: services + 'wallet/wallet.factory',
        // Providers
        cryptoProvider: services + 'crypto/crypto.provider',
        templateProvider: services + 'template/template.provider',
        // Shared
        messageValidator: shared + 'validators/message/messageValidator.directive',
        inputValidator: shared + 'validators/input/inputValidator.directive',
        formValidator: shared + 'validators/form/formValidator.directive',
        buttonValidator: shared + 'validators/button/buttonValidator.directive',
        minLengthValidator: shared + 'validators/minLength/minLength.directive',
        // Directives
        translate: shared + 'translate/translate.directive',
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
        videojsAds: {
            deps: ['add-video-js-in-global-scope'],
        },
        videojsIma: {
            deps: ['add-video-js-in-global-scope'],
        },
        videojsYoutube: {
            deps: ['add-video-js-in-global-scope'],
        },
        appMember: {
            deps: [
                'jquery',
                'angular',
                'ngAnimate',
                'ngSanitize',
                'ngRoute',
                'ngLodash',
                'ocLazyLoad',
                'ngBreadcrumb',
                'ngBootstrap',
                'ngLoadingbar',
                'ngBlock',
                'ngToastr',
                'ngSweetalert',
                'ngTable',
            ],
        },
        appConfig: {
            deps: ['appMember'],
        },
        appRun: {
            deps: ['appMember'],
        },
    },
});

define('global/window', [], function () {
    return window;
});

define('global/document', [], function () {
    return window.document;
});

define('add-video-js-in-global-scope', ['videojs'], function (videojs) {
    window.videojs = videojs;
});

require(['jquery', 'popper', 'moment', 'bootstrap'], function () {});

require(['appMember', 'appConfig', 'appRun', 'appConstant'], function () {
    angular.bootstrap(document, ['appMember']);
});
