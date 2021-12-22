define(['appMember', 'ngTable', 'accountFactory', 'cashoutFactory'], function () {
    'use strict';

    angular.module('appMember').directive('cashouts', cashouts);

    function cashouts(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: cashoutsController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/cashouts/cashouts.tpl.html',
        };

        return directive;

        function cashoutsController($scope, $filter, $uibModal, accountFactory, cashoutFactory, NgTableParams, toastr) {
            var vm = this;
            vm.openCashoutModal = openCashoutModal;
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
                        loadCashoutsTable();
                    }
                );
            }

            function loadCashoutsTable() {
                vm.cashoutsTable = new NgTableParams(
                    {
                        page: 1,
                        count: 5,
                    },
                    {
                        counts: [5, 10, 20, 30, 50, 100],
                        getData: function (params) {
                            return cashoutFactory
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
                                    return page;
                                })
                                .catch(function (error) {
                                    toastr.error(error);
                                });
                        },
                    }
                );
            }

            function openCashoutModal(cashout) {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/cashouts/cashoutSummary/cashoutSummary.tpl.html',
                    size: 'lg',
                    controller: 'CashoutSummaryController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'CashoutSummaryController',
                                    files: [
                                        DIRECTORY.COMPONENTS + '/cashouts/cashoutSummary/cashoutSummary.controller.js',
                                    ],
                                },
                            ]);
                        },
                        cashoutObject: function () {
                            return {
                                cashout: cashout,
                            };
                        },
                    },
                });
            }
        }

        function link(scope, elem, attrs) {}
    }
});
