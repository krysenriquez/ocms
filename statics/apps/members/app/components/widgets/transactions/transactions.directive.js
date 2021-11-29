define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('transactionsWidget', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: transactionsWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/transactions/transactions.tpl.html',
            scope: {},
        };

        return directive;

        function transactionsWidgetController() {
            var vm = this;

            init();

            function init() {}
        }

        function link() {}
    });
});
