define(['appAdmin', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('salesMatchWidget', salesMatchWidget);

    function salesMatchWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: salesMatchWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/top/salesMatch/salesMatch.tpl.html',
            scope: {},
        };

        return directive;

        function salesMatchWidgetController(accountFactory, _, blockUI, toastr) {
            var vm = this;
            init();

            function init() {
                getTopSalesMatches();
            }

            function getTopSalesMatches() {
                accountFactory
                    .getTopBinary(accountFactory.SALES_MATCH)
                    .then(function (response) {
                        console.log(response);
                        vm.accounts = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }
        }

        function link() {}
    }
});
