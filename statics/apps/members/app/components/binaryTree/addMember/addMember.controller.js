define(['codesFactory', 'messageValidator', 'inputValidator'], function () {
    'use strict';

    angular.module('appMember').controller('AddMemberController', AddMemberController);

    function AddMemberController($uibModalInstance, nodeObject, codesFactory, toastr) {
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
        vm.new = {};

        init();

        function init() {
            vm.form = {};
            vm.validation = {};
            vm.new.parentSide = nodeObject.parentSide;
            vm.new.parentName = nodeObject.parentName;
            vm.new.parentAccountId = nodeObject.parentAccountNumber;
        }

        function validateActivationCode() {
            if (angular.isDefined(vm.new.activationCode)) {
                codesFactory
                    .verifyCode({
                        code_type: 'ACTIVATION',
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
        }

        function save() {
            console.log('test');
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
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
