define(['cashoutFactory'], function () {
    'use strict';

    angular.module('appMember').controller('CashoutSummaryController', CashoutSummaryController);

    function CashoutSummaryController($uibModalInstance, $filter, cashoutObject, cashoutFactory, _, toastr) {
        var vm = this;
        vm.cancel = cancel;
        init();

        function init() {
            vm.cashout = cashoutObject.cashout;
            getCashoutTax().then(function (response) {
                vm.cashout.amountToReceive = vm.cashout.amount * (1 - response.tax);
            });
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

        function cancel() {
            $uibModalInstance.close();
        }
    }
});
