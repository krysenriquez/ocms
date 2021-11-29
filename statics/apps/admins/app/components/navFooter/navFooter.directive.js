define(['appAdmin'], function () {
    'use strict';

    angular.module('appAdmin').directive('navFooter', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            controller: navFooterController,
            controllerAs: 'nf',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/navFooter/navFooter.tpl.html',
            scope: {},
        };

        return directive;

        function navFooterController(APPNAME) {
            var vm = this;

            init();

            function init() {
                vm.yearNow = new Date().getFullYear();
                vm.appName = APPNAME;
            }
        }

        function link() {}
    });
});
