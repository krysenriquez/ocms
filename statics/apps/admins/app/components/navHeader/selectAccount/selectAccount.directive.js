define(['appAdmin', 'humpsFactory', 'accountFactory', 'userFactory', 'localStorageFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('selectAccountDropdown', selectAccountDropdown);

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

        function selectAccountDropdownController(userFactory, humpsFactory, toastr, _, accountFactory) {
            var vm = this;
            vm.selectAccount = selectAccount;
            init();

            function init() {
                userFactory.getUserAccounts().then(function (response) {
                    vm.userAccounts = response;
                });
            }

            function selectAccount(account) {
                accountFactory.setSelectedAccount(account);
            }
        }

        function link(scope, elem, attrs) {}
    }
});
