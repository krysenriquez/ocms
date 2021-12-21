define(['appAdmin', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('overlayClick', overlayClick);

    function overlayClick() {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {
                    if (elem.hasClass('overlay')) {
                        angular.element('html').removeClass('sidebar-noneoverflow');
                        angular.element('body').removeClass('sidebar-noneoverflow');
                        angular.element('#container').removeClass('sbar-open');
                        angular.element('#container').toggleClass('sidebar-closed');
                        angular.element('#overlay').removeClass('show');
                    }
                });
            },
        };
    }
});
