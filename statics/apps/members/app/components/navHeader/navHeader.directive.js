define([
    'appMember',
    'app/components/navHeader/collapseSidebar/collapseSidebar.directive',
    'app/components/navHeader/profile/profile.directive',
    'app/components/navHeader/selectAccount/selectAccount.directive',
], function () {
    'use strict';

    angular.module('appMember').directive('navHeader', navHeader);

    function navHeader(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: directiveController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/navHeader/navHeader.tpl.html',
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
