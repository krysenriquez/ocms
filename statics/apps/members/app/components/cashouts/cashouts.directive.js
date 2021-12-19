define(['appMember', 'ngTable', 'accountFactory', 'walletFactory'], function () {
    'use strict';

    angular.module('appMember').directive('cashOuts', cashOuts);

    function cashOuts(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: cashOutsController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/cashouts/cashouts.tpl.html',
        };

        return directive;

        function cashOutsController($scope, $filter, accountFactory, walletFactory, NgTableParams, toastr) {
            var vm = this;
            var accountId;
            init();

            function init() {
                $scope.$watch(
                    function () {
                        return accountFactory.getSelectedAccount().accountId;
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            accountId = newValue;
                        } else {
                            accountId = oldValue;
                        }
                        loadCashOutsTable();
                    }
                );
            }

            function loadCashOutsTable() {
                vm.cashOutsTable = new NgTableParams(
                    {
                        page: 1,
                        count: 5,
                    },
                    {
                        counts: [5, 10, 20, 30, 50, 100],
                        getData: function (params) {
                            return walletFactory
                                .getCashouts(accountId)
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
                                    console.log(page);
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
