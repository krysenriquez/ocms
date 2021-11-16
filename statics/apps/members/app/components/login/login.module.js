define(['authLoginService', 'routerProvider', 'ocLazyLoad', 'directoryFactory'], function () {
    'use strict';
    angular.module('login.module', ['auth.login', 'router.module', 'oc.lazyLoad', 'directory.module']);
});
