define(['appAdmin', 'humpsFactory', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('profileDropdown', profileDropdown);

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

        function profileDropdownController($scope, $state, localStorageFactory, userFactory, authLoginService) {
            var vm = this;
            vm.logout = logout;

            init();

            function init() {
                $scope.$watch(
                    function () {
                        return userFactory.getUser();
                    },
                    function (newValue, oldValue) {
                        var user;
                        if (newValue !== oldValue) {
                            user = newValue;
                        } else {
                            user = oldValue;
                        }
                        vm.user = user;
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
