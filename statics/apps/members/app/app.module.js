define(['ngRoute'], function () {
    'use strict';
    angular.module('appMember', [
        'ui.router',
        'oc.lazyLoad',
        'ncy-angular-breadcrumb',
        'lodash',
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap',
        'blockUI',
        'toastr',
        'oitozero.ngSweetAlert',
        'ngTable',
    ]);
});
