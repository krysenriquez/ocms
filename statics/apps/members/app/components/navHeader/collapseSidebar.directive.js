define(['appMember', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').directive('collapseSidebar', function (DIRECTORY) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {
                    if (elem.hasClass('sidebarCollapse')) {
                        angular.element('html').toggleClass('sidebar-noneoverflow');
                        angular.element('body').toggleClass('sidebar-noneoverflow');
                        angular.element('#container').toggleClass('topbar-closed sbar-open');
                        angular.element('#overlay').toggleClass('show');
                    }
                });
            },
        };
    });
});
