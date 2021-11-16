define(['loginModule'], function () {
    'use strict';

    angular.module('login.module').controller('LoginController', LoginController);

    LoginController.$inject = ['authLoginService'];

    function LoginController(AuthLoginService) {
        var vm = this;

        vm.validate = validate;

        function validate() {
            AuthLoginService.login(vm.user).then(function (response) {
                console.log(response);
            });
        }
    }
});
