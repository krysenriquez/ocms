define(['appMember', 'humpsFactory', 'accountFactory', 'userFactory', 'localStorageFactory'], function () {
    'use strict';

    angular.module('appMember').directive('selectAccountDropdown', selectAccountDropdown);

    function selectAccountDropdown(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: selectAccountDropdownController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/navHeader/selectAccount/selectAccount.tpl.html',
            scope: {},
        };

        return directive;

        function selectAccountDropdownController(
            userFactory,
            humpsFactory,
            toastr,
            _,
            localStorageFactory,
            accountFactory
        ) {
            var vm = this;
            vm.selectAccount = selectAccount;
            init();

            function init() {
                var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                userFactory
                    .getUserAccounts()
                    .then(function (response) {
                        var responseData = humpsFactory.camelizeKeys(response.data[0]);
                        vm.userAccounts = [];
                        _.map(responseData.accountUser, function (account) {
                            vm.userAccounts.push({
                                accountId: account.accountId,
                                accountName: account.accountName,
                                accountNumber: account.accountNumber,
                                avatar:
                                    account.avatarInfo.length > 0 ? account.avatarInfo[0].fileAttachment : blankAvatar,
                            });
                        });
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }

            function selectAccount(account) {
                localStorageFactory.put('selectedAccount', account);
                accountFactory.setSelectedAccount(account);
            }
        }

        function link(scope, elem, attrs) {}
    }
});
