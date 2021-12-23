define([], function () {
    'use strict';

    angular.module('appMember').service('urlService', urlService);

    function urlService() {
        var BASE_URL = '/webapi/';
        var BASE_AUTH = BASE_URL + 'auth/';
        var USERS_ROOT = BASE_URL + 'users/';
        var ACCOUNTS_ROOT = BASE_URL + 'accounts/';
        var ACTIVITIES_ROOT = BASE_URL + 'activities/';
        var SETTINGS_ROOT = BASE_URL + 'settings/';

        this.AUTH_MEMBER = BASE_AUTH + 'member/';
        this.AUTH_WHOAMI = BASE_AUTH + 'whoamimember/';
        this.AUTH_GET = BASE_AUTH + 'get/';
        this.AUTH_LOGOUT = BASE_AUTH + 'logout/';

        this.CREATE_ACCOUNT = ACCOUNTS_ROOT + 'create/';
        this.GENEALOGY = ACCOUNTS_ROOT + 'genealogy/';
        this.GET_ACCOUNT_CODES = ACCOUNTS_ROOT + 'getaccountcodes/';
        this.VERIFY_SPONSOR_CODE = ACCOUNTS_ROOT + 'verifysponsorcode/';

        this.GET_USER_ACCOUNTS = USERS_ROOT + 'getuseraccounts/';
        this.GET_USER_ACCOUNTS_COUNT = USERS_ROOT + 'useraccounts/';
        this.VERIFY_USERNAME = USERS_ROOT + 'checkusername/';
        this.VERIFY_EMAIL_ADDRESS = USERS_ROOT + 'checkemailaddress/';
        this.VERIFY_PASSWORD = USERS_ROOT + 'checkpassword/';

        this.GET_ACTIVITY_SUMMARY = ACTIVITIES_ROOT + 'getactivitysummaryinfo/';
        this.GET_WALLET_INFO = ACTIVITIES_ROOT + 'getwalletinfo/';
        this.GET_WALLET_SUMMARY = ACTIVITIES_ROOT + 'getwalletsummary/';
        this.GET_PAYMENT_METHODS = ACTIVITIES_ROOT + 'getpaymentmethods/';
        this.GET_CASHOUTS = ACTIVITIES_ROOT + 'getcashouts/';
        this.REQUEST_CASHOUT = ACTIVITIES_ROOT + 'request/';

        this.GET_WALLETS = SETTINGS_ROOT + 'getmemberwallets/';
        this.GET_CASHOUT_TAX = SETTINGS_ROOT + 'getcashouttax/';
        this.VERIFY_WALLET_CASHOUT = SETTINGS_ROOT + 'checkwalletcashout/';
    }
});
