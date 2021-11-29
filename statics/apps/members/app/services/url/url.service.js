define([], function () {
    'use strict';

    angular.module('appMember').service('urlService', function () {
        var BASE_URL = '/webapi/';
        var BASE_AUTH = BASE_URL + 'auth/';
        var USERS_ROOT = BASE_URL + 'users/';
        var ACCOUNTS_ROOT = BASE_URL + 'accounts/';

        this.AUTH_MEMBER = BASE_AUTH + 'member/';
        this.AUTH_WHOAMI = BASE_AUTH + 'whoami/';
        this.AUTH_LOGOUT = BASE_AUTH + 'logout/';

        this.ACCOUNT_AVATAR = ACCOUNTS_ROOT + 'accountavatar/';
        this.GENEALOGY = ACCOUNTS_ROOT + 'genealogy/';
        this.CODES = ACCOUNTS_ROOT + 'codes/';
    });
});
