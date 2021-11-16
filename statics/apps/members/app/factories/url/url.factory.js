define([], function () {
    'use strict';

    angular.module('url.module', []).factory('urlFactory', UrlFactory);

    function UrlFactory() {
        var exports = [];

        exports.BASE_URL = '/webapi/';
        exports.BASE_AUTH = exports.BASE_URL + 'auth/';
        exports.AUTH_ADMIN = exports.BASE_AUTH + 'member/';
        exports.AUTH_MEMBER = exports.BASE_AUTH + 'member/';
        exports.AUTH_WHOAMI = exports.BASE_AUTH + 'whoami/';
        exports.USERS_ROOT = exports.BASE_URL + 'users/';
        exports.ACCOUNTS_ROOT = exports.BASE_URL + 'accounts/';
        return exports;
    }
});
