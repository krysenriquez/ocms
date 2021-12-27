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

        function profileDropdownController(
            $scope,
            $state,
            $uibModal,
            localStorageFactory,
            accountFactory,
            authLoginService
        ) {
            var vm = this;
            vm.logout = logout;
            vm.viewUserAccount = viewUserAccount;

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
                        localStorageFactory.removeAll();
                        $state.go('simple.login');
                    }
                });
            }

            function viewUserAccount() {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/navHeader/account/account.tpl.html',
                    size: 'sm',
                    controller: 'UserAccountController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'UserAccountController',
                                    files: [DIRECTORY.COMPONENTS + '/navHeader/account/account.controller.js'],
                                },
                            ]);
                        },
                    },
                });
            }
        }

        function link() {}
    }
});
