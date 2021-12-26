define(['appAdmin', 'cashoutFactory', 'app/shared/initials/initials.filter'], function () {
    'use strict';

    angular.module('appAdmin').directive('expensesWidget', expensesWidget);

    function expensesWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: expensesWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/expenses/expenses.tpl.html',
            scope: {},
        };

        return directive;

        function expensesWidgetController($scope, cashoutFactory, _, blockUI, toastr) {
            var vm = this;
            init();

            function init() {
                viewActivitySummary();
            }

            function viewActivitySummary() {
                cashoutFactory
                    .getPendingCashouts()
                    .then(function (response) {
                        vm.expenses = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }
        }

        function link() {}
    }
});
