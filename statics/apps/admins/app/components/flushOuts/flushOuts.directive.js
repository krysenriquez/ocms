define(['appAdmin', 'ngTable', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('flushOuts', flushOuts);

    function flushOuts(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: flushOutsController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/flushOuts/flushOuts.tpl.html',
        };

        return directive;

        function flushOutsController($scope, $filter, accountFactory, NgTableParams, toastr) {
            var vm = this;

            init();

            function init() {
                loadFlushOutsTable();
            }

            function loadFlushOutsTable() {
                vm.flushedOutTable = new NgTableParams(
                    {
                        page: 1,
                        count: 10,
                    },
                    {
                        counts: [10, 20, 30, 50, 100],
                        getData: function (params) {
                            return accountFactory
                                .getBinary(accountFactory.FLUSHED_OUT)
                                .then(function (response) {
                                    var filteredData = params.filter()
                                        ? $filter('filter')(response, params.filter())
                                        : response;
                                    var orderedData = params.sorting()
                                        ? $filter('orderBy')(filteredData, params.orderBy())
                                        : filteredData;
                                    var page = orderedData.slice(
                                        (params.page() - 1) * params.count(),
                                        params.page() * params.count()
                                    );
                                    params.total(response.length);
                                    var page = orderedData.slice(
                                        (params.page() - 1) * params.count(),
                                        params.page() * params.count()
                                    );
                                    return page;
                                })
                                .catch(function (error) {
                                    toastr.error(error);
                                });
                        },
                    }
                );
            }
        }

        function link(scope, elem, attrs) {}
    }
});
