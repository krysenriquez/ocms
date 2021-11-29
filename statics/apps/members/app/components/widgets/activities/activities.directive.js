define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('activitiesWidget', function (DIRECTORY) {
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

        function activitiesWidgetController() {
            var vm = this;

            init();

            function init() {}
        }

        function link() {}
    });
});
