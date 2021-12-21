define(['walletFactory', 'messageValidator', 'inputValidator', 'formValidator', 'statusFactory'], function () {
    'use strict';

    angular.module('appAdmin').controller('WalletCashoutController', WalletCashoutController);

    function WalletCashoutController(
        $uibModalInstance,
        $filter,
        walletObject,
        walletFactory,
        statusFactory,
        _,
        toastr
    ) {
        var vm = this;
        vm.cancel = cancel;
        vm.validateAmount = validateAmount;
        vm.requestCashout = requestCashout;
        vm.shouldDisableCashoutAmount = false;
        vm.cashout = {};
        vm.validation = {};
        vm.form = {};
        init();

        function init() {
            vm.cashoutBracket = walletObject.response;
            vm.cashout.accountId = walletObject.accountId;
            vm.cashout.wallet = walletObject.walletInfo.wallet;
            vm.cashout.details = {
                note: '',
            };
            if (typeof vm.cashoutBracket.bracket == 'number') {
                vm.cashout.amount = vm.cashoutBracket.bracket;
                vm.shouldDisableCashoutAmount = true;
                validateAmount();
            }
            getPaymentMethods();
        }

        function getPaymentMethods() {
            walletFactory
                .getCashoutMethods()
                .then(function (response) {
                    vm.paymentMethods = response.methods;
                })
                .catch(function (error) {
                    toastr.error(error);
                });
        }

        function validateAmount() {
            if (angular.isDefined(vm.cashout.amount)) {
                if (vm.cashout.amount > walletObject.walletInfo.total) {
                    vm.validation.amount = {
                        message: 'Insufficient Wallet Balance.',
                        status: statusFactory.FORBIDDEN,
                    };
                } else {
                    vm.validation.amount = {
                        message: 'Cashout available.',
                        status: statusFactory.OK,
                    };
                }
                console.log(vm.validation.amount);
            }
        }

        function cancel() {
            $uibModalInstance.close();
        }

        function requestCashout() {
            walletFactory
                .requestCashout(vm.cashout)
                .then(function (response) {
                    toastr.success(response.message);
                    $uibModalInstance.close();
                })
                .catch(function (error) {
                    toastr.error(error.data.message);
                });
        }
    }
});
