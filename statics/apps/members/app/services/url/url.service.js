define([], function () {
    'use strict';

    angular.module('appMember').service('urlService', urlService);

    function urlService() {
        var BASE_URL = '/webapi/';
        var BASE_AUTH = BASE_URL + 'auth/';
        var USERS_ROOT = BASE_URL + 'users/';
        var ACCOUNTS_ROOT = BASE_URL + 'accounts/';

        this.AUTH_MEMBER = BASE_AUTH + 'member/';
        this.AUTH_WHOAMI = BASE_AUTH + 'whoami/';
        this.AUTH_GET = BASE_AUTH + 'get/';
        this.AUTH_LOGOUT = BASE_AUTH + 'logout/';

        this.GENEALOGY = ACCOUNTS_ROOT + 'genealogy/';
        this.GET_ACCOUNT_CODES = ACCOUNTS_ROOT + 'getaccountcodes/';
        this.VERIFY_SPONSOR_CODE = ACCOUNTS_ROOT + 'verifysponsorcode/';

        this.GET_USER_ACCOUNTS = USERS_ROOT + 'getuseraccounts/';
    }
});
