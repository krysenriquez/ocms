define(['appAdmin'], function () {
    'use strict';

    angular.module('appAdmin').directive('navMenu', navMenu);

    function navMenu(DIRECTORY) {
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
    }
});
