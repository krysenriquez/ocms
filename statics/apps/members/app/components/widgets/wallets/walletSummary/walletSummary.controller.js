define(['activityFactory'], function () {
    'use strict';

    angular.module('appMember').controller('WalletSummaryController', WalletSummaryController);

    function WalletSummaryController($uibModalInstance, $filter, walletObject, activityFactory, NgTableParams, toastr) {
        var vm = this;
        vm.cancel = cancel;

        init();

        function init() {
            loadWalletSummaryTable();
        }

        function loadWalletSummaryTable() {
            vm.walletSummaryTable = new NgTableParams(
                {
                    page: 1,
                    count: 10,
                },
                {
                    counts: [5, 10, 20, 30, 50, 100],
                    getData: function (params) {
                        return activityFactory
                            .getWalletSummary(walletObject.accountId, walletObject.wallet)
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

        function cancel() {
            $uibModalInstance.close();
        }
    }
});
