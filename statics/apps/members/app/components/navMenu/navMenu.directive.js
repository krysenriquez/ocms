define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('navMenu', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: directiveController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/navMenu/navMenu.tpl.html',
            scope: {},
        };

        return directive;

        function directiveController(APPNAME, LOGO) {
            var vm = this;

            init();

            function init() {
                vm.appName = APPNAME;
                vm.appLogo = LOGO.NAVLOGO;
            }
        }

        function link() {}
    });
});
