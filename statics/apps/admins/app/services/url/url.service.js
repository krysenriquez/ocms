define([], function () {
    'use strict';

    angular.module('appAdmin').service('urlService', urlService);

    function urlService() {
        var BASE_URL = '/webapi/';
        var BASE_AUTH = BASE_URL + 'auth/';
        var USERS_ROOT = BASE_URL + 'users/';
        var ACCOUNTS_ROOT = BASE_URL + 'accounts/';
        var ACTIVITIES_ROOT = BASE_URL + 'activities/';
        var SETTINGS_ROOT = BASE_URL + 'settings/';

        this.AUTH_ADMIN = BASE_AUTH + 'admin/';
        this.AUTH_WHOAMI = BASE_AUTH + 'whoamiadmin/';
        this.AUTH_WHICH_USER = BASE_AUTH + 'whichuser/';
        this.AUTH_LOGOUT = BASE_AUTH + 'logout/';

        this.GET_BINARY = ACCOUNTS_ROOT + 'getbinary/';
        this.GET_MEMBERS = ACCOUNTS_ROOT + 'getmembers/';
        this.GET_UNLI_TEN = ACCOUNTS_ROOT + 'getunliten/';

        this.GET_ACTIVITY_SUMMARY = ACTIVITIES_ROOT + 'getactivitysummary/';
        this.GET_WALLET_SUMMARY = ACTIVITIES_ROOT + 'getwalletsummary/';

        this.GET_WALLETS = SETTINGS_ROOT + 'getadminwallets/';
        // To
        // Test
        // Below
        this.AUTH_GET = BASE_AUTH + 'get/';

        this.GENEALOGY = ACCOUNTS_ROOT + 'genealogy/';

        this.GET_USER_ACCOUNTS = USERS_ROOT + 'getuseraccounts/';
        this.GET_USER_ACCOUNTS_COUNT = USERS_ROOT + 'useraccounts/';
        this.VERIFY_USERNAME = USERS_ROOT + 'checkusername/';
        this.VERIFY_EMAIL_ADDRESS = USERS_ROOT + 'checkemailaddress/';
        this.VERIFY_PASSWORD = USERS_ROOT + 'checkpassword/';

        this.GET_PAYMENT_METHODS = ACTIVITIES_ROOT + 'getpaymentmethods/';
        this.GET_CASHOUTS = ACTIVITIES_ROOT + 'getcashouts/';
        this.REQUEST_CASHOUT = ACTIVITIES_ROOT + 'request/';

        this.VERIFY_WALLET_CASHOUT = SETTINGS_ROOT + 'checkwalletcashout/';
    }
});
