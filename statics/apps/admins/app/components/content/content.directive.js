define(['appAdmin'], function () {
    'use strict';

    angular.module('appAdmin').directive('appContent', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: directiveController,
            controllerAs: 'Ctrl',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/content/content.tpl.html',
            scope: {},
        };

        return directive;

        function directiveController() {
            var vm = this;

            init();

            function init() {}
        }

        function link() {}
    });
});
