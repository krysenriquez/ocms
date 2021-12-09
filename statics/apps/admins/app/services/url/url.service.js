define([], function () {
    'use strict';

    angular.module('appAdmin').service('urlService', function () {
        var BASE_URL = '/webapi/';
        var BASE_AUTH = BASE_URL + 'auth/';
        var USERS_ROOT = BASE_URL + 'users/';
        var ACCOUNTS_ROOT = BASE_URL + 'accounts/';

        this.AUTH_ADMIN = BASE_AUTH + 'admin/';
        this.AUTH_WHOAMI = BASE_AUTH + 'whoami/';
        this.AUTH_LOGOUT = BASE_AUTH + 'logout/';

        this.GENEALOGY = ACCOUNTS_ROOT + 'genealogy/';
    });
});
