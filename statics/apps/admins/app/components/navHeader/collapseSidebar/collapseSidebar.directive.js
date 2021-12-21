define(['appAdmin', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('collapseSidebar', collapseSidebar);

    function collapseSidebar($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {
                    if (elem.hasClass('sidebar-collapse')) {
                        angular.element('html').toggleClass('sidebar-noneoverflow');
                        angular.element('body').toggleClass('sidebar-noneoverflow');
                        if ($window.innerWidth >= 991) {
                            angular.element('header').toggleClass('expand-header');
                            angular.element('#container').toggleClass('sidebar-closed sbar-open');
                        } else {
                            angular.element('#container').toggleClass('sidebar-closed');
                            angular.element('#container').toggleClass('sbar-open');
                            angular.element('#overlay').toggleClass('show');
                        }
                    }
                });

                angular.element($window).bind('resize', function () {
                    if ($window.innerWidth >= 991) {
                        angular.element('header').removeClass('expand-header');
                        angular.element('#container').removeClass('sidebar-closed sbar-open');
                    } else {
                        angular.element('#container').addClass('sidebar-closed');
                        angular.element('#container').removeClass('sbar-open');
                        angular.element('#overlay').toggleClass('show');
                    }
                });
            },
        };
    }
});
