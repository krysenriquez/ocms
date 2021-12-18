define([
    'codesFactory',
    'messageValidator',
    'inputValidator',
    'formValidator',
    'userFactory',
    'verifyFactory',
], function () {
    'use strict';

    angular.module('appMember').controller('AddMemberController', AddMemberController);

    function AddMemberController(
        $state,
        $uibModalInstance,
        nodeObject,
        codesFactory,
        toastr,
        userFactory,
        accountFactory,
        verifyFactory
    ) {
        var vm = this;
        vm.save = save;
        vm.cancel = cancel;
        vm.next = next;
        vm.previous = previous;
        vm.step = 1;
        vm.validateActivationCode = validateActivationCode;
        vm.shouldShowButton = shouldShowButton;
        vm.shouldShowPreviousButton = shouldShowPreviousButton;
        vm.shouldShowNextButton = shouldShowNextButton;
        vm.shouldShowSaveButton = shouldShowSaveButton;
        vm.useCurrentUser = useCurrentUser;
        vm.shouldDisableUseCurrentUser = shouldDisableUseCurrentUser;
        vm.validateUsername = validateUsername;
        vm.validateEmailAddress = validateEmailAddress;
        vm.new = {};
        vm.form = {};
        vm.validation = {};
        var remainingUserAccount;

        init();

        function init() {
            vm.new.parentSide = nodeObject.parentSide;
            vm.new.parentName = nodeObject.parentName;
            vm.new.parentAccountId = nodeObject.parentAccountNumber;
            getUserAccountCount().then(function (response) {
                remainingUserAccount = response;
            });
        }

        function validateActivationCode() {
            codesFactory
                .verifyCode({
                    codeType: 'ACTIVATION',
                    code: vm.new.activationCode,
                    parent: Number(vm.new.parentAccountId),
                })
                .then(function (response) {
                    vm.new.sponsorName = response.data.sponsorName;
                    vm.new.sponsorAccountId = response.data.sponsor;
                    vm.validation.activationCode = {
                        message: response.data.message,
                        status: response.status,
                    };
                    toastr.success(response.data.message);
                })
                .catch(function (error) {
                    vm.validation.activationCode = {
                        message: error.data.message,
                        status: error.status,
                    };
                    toastr.error(error.data.message);
                });
        }

        function useCurrentUser() {
            if (vm.currentUser) {
                userFactory.getUserAccounts().then(function (response) {
                    vm.userAccounts = response;
                    vm.new.user = 'link';
                });
            } else {
                vm.new.user = {};
            }
        }

        function getUserAccountCount() {
            return userFactory.getRemainingUserAccountCount().then(function (response) {
                return response;
            });
        }

        function shouldDisableUseCurrentUser() {
            return remainingUserAccount == 0;
        }

        function validateUsername() {
            verifyFactory
                .verifyUsername({
                    username: vm.new.user.username,
                })
                .then(function (response) {
                    vm.validation.username = {
                        message: response.data.message,
                        status: response.status,
                    };
                    toastr.success(response.data.message);
                })
                .catch(function (error) {
                    vm.validation.username = {
                        message: error.data.message,
                        status: error.status,
                    };
                    toastr.error(error.data.message);
                });
        }

        function validateEmailAddress() {
            verifyFactory
                .verifyEmailAddress({
                    emailAddress: vm.new.user.emailAddress,
                })
                .then(function (response) {
                    vm.validation.emailAddress = {
                        message: response.data.message,
                        status: response.status,
                    };
                    toastr.success(response.data.message);
                })
                .catch(function (error) {
                    vm.validation.emailAddress = {
                        message: error.data.message,
                        status: error.status,
                    };
                    toastr.error(error.data.message);
                });
        }

        function save() {
            accountFactory
                .createAccount(vm.new)
                .then(function (response) {
                    toastr.success(response.message);
                    $uibModalInstance.close();
                    $state.reload();
                })
                .catch(function (error) {
                    toastr.error(error.data.message);
                });
        }

        function cancel() {
            $uibModalInstance.close();
        }

        function next() {
            vm.step = vm.step + 1;
        }

        function previous() {
            vm.step = vm.step - 1;
        }

        function shouldShowButton(value) {
            switch (value) {
                case 'previous':
                    return vm.step > 1;
                case 'next':
                    return vm.step < 2;
                default:
                    return vm.step == 2;
            }
        }

        function shouldShowPreviousButton() {
            return vm.step > 1;
        }

        function shouldShowNextButton() {
            return vm.step < 2;
        }

        function shouldShowSaveButton() {
            return vm.step == 2;
        }
    }
});
