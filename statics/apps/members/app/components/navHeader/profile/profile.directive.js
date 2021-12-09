define(['appMember', 'humpsFactory', 'accountFactory'], function () {
    'use strict';

    angular.module('appMember').directive('profileDropdown', profileDropdown);

    function profileDropdown(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: profileDropdownController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/navHeader/profile/profile.tpl.html',
            scope: {},
        };

        return directive;

        function profileDropdownController($scope, $state, localStorageFactory, accountFactory, authLoginService) {
            var vm = this;
            vm.logout = logout;

            init();

            function init() {
                $scope.$watch(
                    function () {
                        return accountFactory.getSelectedAccount();
                    },
                    function (newValue, oldValue) {
                        var account;
                        if (newValue !== oldValue) {
                            account = newValue;
                        } else {
                            account = oldValue;
                        }
                        vm.selectedAccount = account;
                    }
                );
            }

            function logout() {
                authLoginService.logout().then(function (response) {
                    if (response) {
                        $state.go('simple.login');
                    }
                });
            }
        }

        function link() {}
    }
});
