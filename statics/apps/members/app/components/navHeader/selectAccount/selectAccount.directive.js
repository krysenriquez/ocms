define([
    'appMember',
    'humpsFactory',
    'accountFactory',
    'userFactory',
    'localStorageFactory',
    'adsService',
], function () {
    'use strict';

    angular.module('appMember').directive('selectAccountDropdown', selectAccountDropdown);

    function selectAccountDropdown(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: selectAccountDropdownController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/navHeader/selectAccount/selectAccount.tpl.html',
            scope: {},
        };

        return directive;

        function selectAccountDropdownController(userFactory, _, accountFactory, adsService) {
            var vm = this;
            vm.selectAccount = selectAccount;
            init();

            function init() {
                userFactory.getUserAccounts().then(function (response) {
                    vm.userAccounts = response;
                });
            }

            function selectAccount(account) {
                adsService.openDirectLink().then(function (response) {
                    accountFactory.setSelectedAccount(account);
                });
            }
        }

        function link(scope, elem, attrs) {}
    }
});
