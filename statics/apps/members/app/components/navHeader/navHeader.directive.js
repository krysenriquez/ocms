define(['appMember', 'humpsFactory', 'accountFactory'], function () {
    'use strict';

    angular.module('appMember').directive('navHeader', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: directiveController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/navHeader/navHeader.tpl.html',
            scope: {},
        };

        return directive;

        function directiveController(
            APPNAME,
            LOGO,
            authLoginService,
            $state,
            $timeout,
            $http,
            urlService,
            humpsFactory,
            accountFactory
        ) {
            var vm = this;
            vm.logout = logout;

            init();

            function init() {
                vm.appName = APPNAME;
                vm.appLogo = LOGO.NAVLOGO;

                $http.get(urlService.ACCOUNT_AVATAR).then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data[0]);
                    vm.account = responseData;
                    accountFactory.setAccountId(responseData.accountId);
                });
            }

            function logout() {
                authLoginService.logout().then(function (response) {
                    if (response) {
                        $state.go('simple.login');
                    }
                });
            }
        }

        function link() {}
    });
});
