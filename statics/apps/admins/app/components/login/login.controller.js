define(['authLoginService'], function () {
    'use strict';

    angular.module('appAdmin').controller('LoginController', function (authLoginService, $state, $timeout) {
        var vm = this;

        vm.validate = validate;
        vm.shouldDisableLogin = shouldDisableLogin;

        function validate() {
            authLoginService.login(vm.user).then(function (response) {
                $state.go('admin.dashboard');
            });
        }

        function shouldDisableLogin() {
            return !!!vm.agreeTerms;
        }
    });
});
