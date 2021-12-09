define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('infoWidget', infoWidget);

    function infoWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: infoWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/info/info.tpl.html',
            scope: {},
        };

        return directive;

        function infoWidgetController() {
            var vm = this;

            init();

            function init() {}
        }

        function link() {}
    }
});
