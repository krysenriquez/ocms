define(['codesFactory', 'accountFactory', 'messageValidator', 'inputValidator', 'formValidator'], function () {
    'use strict';

    angular.module('appAdmin').controller('GenerateCodeController', GenerateCodeController);

    function GenerateCodeController($state, $uibModalInstance, $filter, codesFactory, accountFactory, _, toastr) {
        var vm = this;
        vm.cancel = cancel;
        vm.verifyAccountId = verifyAccountId;
        vm.generateCode = generateCode;
        vm.new = {};
        vm.form = {};
        vm.validation = {};
        init();

        function init() {
            getCodeStatuses();
        }

        function getCodeStatuses() {
            codesFactory
                .getCodeStatus()
                .then(function (response) {
                    vm.codeStatus = _.remove(response.status, function (status) {
                        return status != 'EXPIRED';
                    });
                })
                .catch(function (error) {
                    toastr.error(error.data.message);
                });
        }

        function verifyAccountId() {
            accountFactory
                .verifyCode(vm.new.accountId)
                .then(function (response) {
                    vm.validation.accountId = {
                        message: response.data.message,
                        status: response.status,
                    };
                    toastr.success(response.data.message);
                })
                .catch(function (error) {
                    vm.validation.accountId = {
                        message: error.data.message,
                        status: error.status,
                    };
                    toastr.error(error.data.message);
                });
        }

        function generateCode() {
            accountFactory
                .generateCode(vm.new)
                .then(function (response) {
                    toastr.success(response.data.message);
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
    }
});
