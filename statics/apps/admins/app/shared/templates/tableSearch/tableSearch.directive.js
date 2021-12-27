define(['appAdmin', 'statusFactory'], (function () {
    'use strict';

    angular.module('appAdmin').directive('tableSearch', tableSearch);

    function tableSearch(DIRECTORY) {
        return {
            bindToController: true,
            controller: tableSearchController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: DIRECTORY.SHARED + '/templates/tableSearch/tableSearch.tpl.html',
            scope: {
                table: '=table',
            },
        };

        function tableSearchController($scope) {
            var vm = this;
            $scope.$watch(
                'vm.searchTermAuto',
                function (newTerm, oldTerm) {
                    if (angular.isDefined(vm.table)) {
                        vm.table.filter({ $: newTerm });
                    }
                },
                true
            );
        }
    }
})());
