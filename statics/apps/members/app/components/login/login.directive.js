define(['authLoginService'], function () {
    'use strict';

    angular.module('appMember').directive('login', login);

    function login(DIRECTORY) {
        var directive = {
            bindToController: true,
            controller: loginController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/login/login.tpl.html',
            scope: {},
        };

        return directive;

        function loginController(authLoginService, $state, blockUI, toastr) {
            var vm = this;
            vm.validate = validate;
            vm.shouldDisableLogin = shouldDisableLogin;

            init();

            function init() {}

            function validate() {
                blockUI.start('Validating ...');
                authLoginService
                    .login(vm.user)
                    .then(function (response) {
                        blockUI.stop();
                        toastr.success(response.data.message);
                        $state.go('members.dashboard');
                    })
                    .catch(function (error) {
                        blockUI.stop();
                        toastr.error(error.data.message);
                    });
            }

            function shouldDisableLogin() {
                return !!!vm.agreeTerms;
            }
        }
    }
});
