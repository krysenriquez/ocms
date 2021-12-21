define(['appAdmin', 'ngTable', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('unliTen', unliTen);

    function unliTen(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: unliTenController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/unliTen/unliTen.tpl.html',
        };

        return directive;

        function unliTenController($scope, $filter, accountFactory, NgTableParams, toastr) {
            var vm = this;

            init();

            function init() {
                loadUnliTenTable();
            }

            function loadUnliTenTable() {
                vm.unliTenTable = new NgTableParams(
                    {
                        page: 1,
                        count: 10,
                    },
                    {
                        counts: [10, 20, 30, 50, 100],
                        getData: function (params) {
                            return accountFactory
                                .getUnliTen()
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
