define(['appMember', 'app/shared/initials/initials.filter'], function () {
    'use strict';

    angular.module('appMember').directive('activitiesWidget', activitiesWidget);

    function activitiesWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: activitiesWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/activities/activities.tpl.html',
            scope: {},
        };

        return directive;

        function activitiesWidgetController($scope, accountFactory, activityFactory, _, blockUI, toastr) {
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
                        getRecentActivitySummary();
                    }
                );
            }

            function getRecentActivitySummary() {
                activityFactory
                    .getRecentActivitySummary(accountId)
                    .then(function (response) {
                        vm.activities = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }
        }

        function link() {}
    }
});
