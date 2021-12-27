define([
    'activityFactory',
    'userFactory',
    'statusFactory',
    'messageValidator',
    'inputValidator',
    'formValidator',
    'buttonValidator',
], function () {
    'use strict';

    angular.module('appMember').controller('UserAccountController', UserAccountController);

    function UserAccountController($uibModalInstance, userFactory, statusFactory, toastr, $window) {
        var vm = this;
        vm.cancel = cancel;
        vm.changePassword = changePassword;
        vm.validateRepeatPassword = validateRepeatPassword;
        vm.validateNewPassword = validateNewPassword;
        vm.savePassword = savePassword;
        vm.form = { passwordForm: {} };
        vm.validation = {};
        init();

        function init() {
            vm.editUserAccount = false;
            getUser();
        }

        function getUser() {
            userFactory
                .getUser()
                .then(function (response) {
                    vm.user = response;
                    console.log(vm.user);
                })
                .catch(function (error) {
                    toastr.error(error.data.message);
                });
        }

        function changePassword() {
            vm.editUserAccount = true;
        }

        function validateRepeatPassword() {
            if (vm.edit.repeatPassword === vm.edit.newPassword) {
                vm.validation.repeatPassword = {
                    message: 'Passwords match.',
                    status: statusFactory.OK,
                };
            } else {
                vm.validation.repeatPassword = {
                    message: 'Passwords do not match.',
                    status: statusFactory.BAD_REQUEST,
                };
            }
        }

        function validateNewPassword() {
            if (angular.isDefined(vm.edit.repeatPassword)) {
                if (vm.edit.repeatPassword === vm.edit.newPassword) {
                    vm.validation.repeatPassword = {
                        message: 'Passwords match.',
                        status: statusFactory.OK,
                    };
                } else {
                    vm.validation.repeatPassword = {
                        message: 'Passwords do not match.',
                        status: statusFactory.BAD_REQUEST,
                    };
                }
            }
        }

        function savePassword() {
            userFactory
                .changePassword(vm.edit)
                .then(function (response) {
                    toastr.success(response.message);
                    $uibModalInstance.close();
                    $window.location.reload();
                })
                .catch(function (error) {
                    toastr.error(error.data.message);
                });
        }

        function cancel() {
            $uibModalInstance.close();
        }
    }
});
