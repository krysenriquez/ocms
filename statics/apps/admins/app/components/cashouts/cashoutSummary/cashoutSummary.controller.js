define(['cashoutFactory'], function () {
    'use strict';

    angular.module('appAdmin').controller('CashoutSummaryController', CashoutSummaryController);

    function CashoutSummaryController($state, $uibModalInstance, $filter, cashoutObject, cashoutFactory, _, toastr) {
        var vm = this;
        vm.cancel = cancel;
        vm.saveCashout = saveCashout;
        init();

        function init() {
            vm.cashout = cashoutObject.cashout;
            getCashoutTax().then(function (response) {
                vm.cashout.amountToReceive = vm.cashout.amount * (1 - response.tax);
            });
            getCashoutStatuses();
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

        function getCashoutStatuses() {
            cashoutFactory
                .getCashoutStatus()
                .then(function (response) {
                    vm.cashoutStatuses = response.status;
                    _.each(vm.cashoutStatuses, function (status) {
                        if (status == vm.cashout.status) {
                            vm.newCashoutStatus = status;
                        }
                    });
                })
                .catch(function (error) {
                    toastr.error(error.data.message);
                });
        }

        function saveCashout() {
            cashoutFactory
                .saveCashoutStatus(vm.cashout.cashoutNumber, vm.newCashoutStatus)
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
    }
});
