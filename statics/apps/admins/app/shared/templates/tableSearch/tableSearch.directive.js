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
                table: '=',
            },
        };

        function tableSearchController($scope) {
            var vm = this;
            $scope.$watch(
                'table',
                function (newTerm, oldTerm) {
                    console.log($scope.table);
                },
                true
            );
        }
    }
})());
