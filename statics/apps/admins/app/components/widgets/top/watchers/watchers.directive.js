define(['appAdmin', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('watchersWidget', watchersWidget);

    function watchersWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: watchersWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/top/watchers/watchers.tpl.html',
            scope: {},
        };

        return directive;

        function watchersWidgetController(accountFactory, _, blockUI, toastr) {
            var vm = this;
            init();

            function init() {
                getTopWatchers();
            }

            function getTopWatchers() {
                accountFactory
                    .getTopWatchers()
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
