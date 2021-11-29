define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('balanceWidget', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: balanceWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/balance/balance.tpl.html',
            scope: {},
        };

        return directive;

        function balanceWidgetController() {
            var vm = this;

            init();

            function init() {}
        }

        function link() {}
    });
});
