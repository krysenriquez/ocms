define(['appAdmin', 'settingsFactory', 'activityFactory', 'walletFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('walletsWidget', walletsWidget);

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
            vm.viewWalletDetails = viewWalletDetails;
            vm.isNotCompanyWallet = isNotCompanyWallet;

            init();

            function init() {
                viewWalletDetails();
            }

            function viewWalletDetails() {
                activityFactory
                    .getAllWalletInfo()
                    .then(function (response) {
                        vm.wallets = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }

            function isNotCompanyWallet(wallet) {
                return wallet != 'C_WALLET';
            }
        }

        function link() {}
    }
});
