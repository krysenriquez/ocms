define(['appAdmin'], function () {
    'use strict';

    angular.module('appAdmin').directive('summaryWidget', summaryWidget);

    function summaryWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: summaryWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/summary/summary.tpl.html',
            scope: {},
        };

        return directive;

        function summaryWidgetController($scope, activityFactory, _, blockUI, toastr) {
            var vm = this;
            init();

            function init() {
                viewActivitySummary();
            }

            function viewActivitySummary() {
                activityFactory
                    .getAllActivitySummary()
                    .then(function (response) {
                        vm.summaries = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }
        }

        function link() {}
    }
});
