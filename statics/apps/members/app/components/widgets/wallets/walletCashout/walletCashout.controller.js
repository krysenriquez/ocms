define([
    'cashoutFactory',
    'messageValidator',
    'inputValidator',
    'formValidator',
    'statusFactory',
    'adsService',
], function () {
    'use strict';

    angular.module('appMember').controller('WalletCashoutController', WalletCashoutController);

    function WalletCashoutController(
        $uibModalInstance,
        $filter,
        walletObject,
        cashoutFactory,
        statusFactory,
        adsService,
        _,
        toastr
    ) {
        var vm = this;
        vm.cancel = cancel;
        vm.validateAmount = validateAmount;
        vm.requestCashout = requestCashout;
        vm.shouldDisableCashoutAmount = false;
        vm.cashoutBracket = [];
        vm.cashout = {};
        vm.validation = {};
        vm.form = {};
        vm.tax;
        init();

        function init() {
            vm.cashout.accountId = walletObject.accountId;
            vm.cashout.wallet = walletObject.walletInfo.wallet;
            vm.cashout.details = {
                note: '',
            };
            getCashoutTax().then(function (response) {
                vm.tax = response.tax;
                if (typeof walletObject.response.bracket == 'number') {
                    vm.cashoutBracket.push(walletObject.response.bracket);
                    vm.cashout.amount = walletObject.response.bracket;
                    vm.cashout.amountToReceive = parseInt(walletObject.response.bracket) * (1 - vm.tax);
                    vm.shouldDisableCashoutAmount = true;
                    validateAmount();
                } else {
                    vm.cashoutBracket = walletObject.response.bracket;
                    vm.shouldDisableCashoutAmount = false;
                }
            });
            getPaymentMethods();
        }

        function getCashoutTax() {
            return cashoutFactory
                .getCashoutTax()
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    toastr.error(error.data.message);
                });
        }

        function getPaymentMethods() {
            cashoutFactory
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
                vm.cashout.amountToReceive = vm.cashout.amount * (1 - vm.tax);
            }
        }

        function cancel() {
            $uibModalInstance.close();
        }

        function requestCashout() {
            adsService.openDirectLink().then(function (response) {
                cashoutFactory
                    .requestCashout(vm.cashout)
                    .then(function (response) {
                        toastr.success(response.message);
                        $uibModalInstance.close();
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            });
        }
    }
});
