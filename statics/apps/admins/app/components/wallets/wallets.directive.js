define(['activityFactory', 'settingsFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('wallets', wallets);

    function wallets(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: walletsController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/wallets/wallets.tpl.html',
        };

        return directive;

        function walletsController($filter, activityFactory, settingsFactory, NgTableParams, toastr) {
            var vm = this;
            vm.loadWalletTable = loadWalletTable;

            init();

            function init() {
                loadWallets().then(function (response) {
                    vm.wallets = response;
                    loadWalletTable(vm.wallets[0]);
                });
            }

            function loadWallets() {
                return settingsFactory
                    .getWallets()
                    .then(function (response) {
                        return response.wallets;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }

            function loadWalletTable(wallet) {
                vm.currentWallet = wallet;
                vm.walletTable = new NgTableParams(
                    {
                        page: 1,
                        count: 10,
                    },
                    {
                        counts: [5, 10, 20, 30, 50, 100],
                        getData: function (params) {
                            return activityFactory
                                .getWalletSummary(wallet)
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
