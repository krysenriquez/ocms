define(['authLoginService'], function () {
    'use strict';

    angular.module('appMember').controller('LoginController', function (authLoginService, $state, $timeout) {
        var vm = this;

        vm.validate = validate;
        vm.shouldDisableLogin = shouldDisableLogin;

        function validate() {
            authLoginService.login(vm.user).then(function (response) {
                console.log('HERE');
                $state.go('members.dashboard');
            });
        }

        function shouldDisableLogin() {
            return !!!vm.agreeTerms;
        }
    });
});
