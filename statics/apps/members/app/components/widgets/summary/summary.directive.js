define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('summaryWidget', summaryWidget);

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

        function summaryWidgetController($scope, accountFactory, activityFactory, _, blockUI, toastr) {
            var vm = this;
            var accountId;

            init();

            function init() {
                $scope.$watch(
                    function () {
                        return accountFactory.getSelectedAccount().accountId;
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            accountId = newValue;
                        } else {
                            accountId = oldValue;
                        }
                        viewActivitySummary();
                    }
                );
            }

            function viewActivitySummary() {
                activityFactory
                    .getActivitySummary(accountId)
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
