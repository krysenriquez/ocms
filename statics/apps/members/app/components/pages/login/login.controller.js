define(['authLoginService'], function () {
    'use strict';

    angular.module('appMember').controller('LoginController', LoginController);

    function LoginController(authLoginService, $state, blockUI, toastr) {
        var vm = this;

        vm.validate = validate;
        vm.shouldDisableLogin = shouldDisableLogin;

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
});
