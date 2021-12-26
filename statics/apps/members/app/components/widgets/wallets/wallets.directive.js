define(['appMember', 'settingsFactory', 'activityFactory', 'walletFactory'], function () {
    'use strict';

    angular.module('appMember').directive('walletsWidget', walletsWidget);

    function walletsWidget(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: walletsWidgetController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/widgets/wallets/wallets.tpl.html',
            scope: {},
        };

        return directive;

        function walletsWidgetController(
            $scope,
            accountFactory,
            settingsFactory,
            activityFactory,
            walletFactory,
            $uibModal,
            _,
            blockUI,
            toastr
        ) {
            var vm = this;
            var accountId;
            vm.viewWalletDetails = viewWalletDetails;
            vm.openWalletSummaryModal = openWalletSummaryModal;
            vm.verifyWalletCashout = verifyWalletCashout;
            vm.openWalletCashoutModal = openWalletCashoutModal;

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
                        viewWalletDetails();
                    }
                );
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

            function viewWalletDetails() {
                activityFactory
                    .getWalletInfo(accountId)
                    .then(function (response) {
                        vm.wallets = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }

            function openWalletSummaryModal(walletInfo) {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/widgets/wallets/walletSummary/walletSummary.tpl.html',
                    size: 'xl',
                    controller: 'WalletSummaryController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'WalletSummaryController',
                                    files: [
                                        DIRECTORY.COMPONENTS +
                                            '/widgets/wallets/walletSummary/walletSummary.controller.js',
                                    ],
                                },
                            ]);
                        },
                        walletObject: function () {
                            return {
                                wallet: walletInfo.wallet,
                                accountId: accountId,
                            };
                        },
                    },
                });
            }

            function verifyWalletCashout(walletInfo) {
                walletFactory
                    .verifyWalletCashout(accountId, walletInfo.wallet)
                    .then(function (response) {
                        openWalletCashoutModal(walletInfo, response);
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }

            function openWalletCashoutModal(walletInfo, response) {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/widgets/wallets/walletCashout/walletCashout.tpl.html',
                    size: 'xl',
                    controller: 'WalletCashoutController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'WalletCashoutController',
                                    files: [
                                        DIRECTORY.COMPONENTS +
                                            '/widgets/wallets/walletCashout/walletCashout.controller.js',
                                    ],
                                },
                            ]);
                        },
                        walletObject: function () {
                            return {
                                walletInfo: walletInfo,
                                accountId: accountId,
                                response: response,
                            };
                        },
                    },
                });
            }
        }

        function link() {}
    }
});
