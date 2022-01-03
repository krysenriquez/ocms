define(['appAdmin', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('earnersWidget', earnersWidget);

    function earnersWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: earnersWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/top/earners/earners.tpl.html',
            scope: {},
        };

        return directive;

        function earnersWidgetController(accountFactory, _, blockUI, toastr) {
            var vm = this;
            init();

            function init() {
                getTopEarners();
            }

            function getTopEarners() {
                accountFactory
                    .getTopEarners()
                    .then(function (response) {
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
