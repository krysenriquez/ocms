define(['appMember', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').directive('overlayClick', function (DIRECTORY) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {
                    if (elem.hasClass('overlay')) {
                        angular.element('html').removeClass('sidebar-noneoverflow');
                        angular.element('body').removeClass('sidebar-noneoverflow');
                        angular.element('#container').removeClass('topbar-closed sbar-open');
                        angular.element('#overlay').removeClass('show');
                    }
                });
            },
        };
    });
});
