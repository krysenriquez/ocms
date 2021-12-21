define(['appAdmin'], function () {
    'use strict';

    angular.module('appAdmin').directive('transactionsWidget', transactionsWidget);

    function transactionsWidget(DIRECTORY) {
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
    }
});
