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
        this.GET_REFERRALS = ACCOUNTS_ROOT + 'getreferrals/';
        this.GET_UNLI_TEN = ACCOUNTS_ROOT + 'getunliten/';
        this.GET_ACCOUNT_CODES = ACCOUNTS_ROOT + 'getallaccountcodes/';
        this.GET_CODE_STATUS = ACCOUNTS_ROOT + 'getcodestatus/';
        this.VERIFY_ACCOUNT = ACCOUNTS_ROOT + 'verifyaccount/';
        this.GENERATE_CODE = ACCOUNTS_ROOT + 'generatecode/';
        this.GET_TOP_BINARY = ACCOUNTS_ROOT + 'gettopbinarysummary/';
        this.GET_TOP_EARNERS = ACCOUNTS_ROOT + 'gettopearners/';

        this.GET_ALL_WALLET_INFO = ACTIVITIES_ROOT + 'getallwalletinfo/';
        this.GET_ALL_ACTIVITY_SUMMARY = ACTIVITIES_ROOT + 'getallactivitysummaryinfo/';
        this.GET_ACTIVITY_SUMMARY = ACTIVITIES_ROOT + 'getactivitysummary/';
        this.GET_WALLET_SUMMARY = ACTIVITIES_ROOT + 'getallwalletsummary/';
        this.GET_CASHOUTS = ACTIVITIES_ROOT + 'getadmincashouts/';
        this.GET_PENDING_CASHOUTS = ACTIVITIES_ROOT + 'getpendingcashouts/';
        this.GET_CASHOUT_STATUS = ACTIVITIES_ROOT + 'getcashoutstatus/';
        this.UPDATE_CASHOUT_STATUS = ACTIVITIES_ROOT + 'updatecashoutstatus/';

        this.GET_CASHOUT_TAX = SETTINGS_ROOT + 'getcashouttax/';
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
        this.REQUEST_CASHOUT = ACTIVITIES_ROOT + 'request/';

        this.VERIFY_WALLET_CASHOUT = SETTINGS_ROOT + 'checkwalletcashout/';
    }
});
