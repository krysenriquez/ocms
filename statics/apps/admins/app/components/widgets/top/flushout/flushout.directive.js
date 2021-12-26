define(['appAdmin', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('flushOutWidget', flushOutWidget);

    function flushOutWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: flushOutWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/top/flushout/flushout.tpl.html',
            scope: {},
        };

        return directive;

        function flushOutWidgetController(accountFactory, _, blockUI, toastr) {
            var vm = this;
            init();

            function init() {
                getTopFlushOuts();
            }

            function getTopFlushOuts() {
                accountFactory
                    .getTopBinary(accountFactory.FLUSHED_OUT)
                    .then(function (response) {
                        console.log(response);
                        vm.accounts = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }
        }

        function link() {}
    }
});
