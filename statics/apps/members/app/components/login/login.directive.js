define(['authLoginService', 'adsService'], function () {
    'use strict';

    angular.module('appMember').directive('login', login);

    function login(DIRECTORY) {
        var directive = {
            bindToController: true,
            controller: loginController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/login/login.tpl.html',
            scope: {},
        };

        function loginController(authLoginService, adsService, $state, $uibModal, blockUI, toastr) {
            var vm = this;
            vm.validate = validate;
            vm.shouldDisableLogin = shouldDisableLogin;
            vm.viewTermsAndConditions = viewTermsAndConditions;

            init();

            function init() {}

            function validate() {
                adsService.openDirectLink().then(function (response) {
                    blockUI.start('Validating ...');
                    authLoginService
                        .login(vm.user)
                        .then(function (response) {
                            blockUI.stop();
                            toastr.success(response.data.message);
                            $state.go('members.dashboard');
                        })
                        .catch(function (error) {
                            blockUI.stop();
                            toastr.error(error.data.message);
                        });
                });
            }

            function shouldDisableLogin() {
                return !!!vm.agreeTerms;
            }

            function viewTermsAndConditions() {
                adsService.openDirectLink().then(function (response) {
                    $uibModal.open({
                        animation: true,
                        backdrop: false,
                        templateUrl: DIRECTORY.COMPONENTS + '/login/termsAndConditions/termsAndConditions.tpl.html',
                        size: 'lg',
                        controller: 'TermsAndConditionsController',
                        controllerAs: 'vm',
                        bindToController: true,
                        resolve: {
                            loadController: function ($ocLazyLoad, DIRECTORY) {
                                return $ocLazyLoad.load([
                                    {
                                        serie: true,
                                        name: 'TermsAndConditionsController',
                                        files: [
                                            DIRECTORY.COMPONENTS +
                                                '/login/termsAndConditions/termsAndConditions.controller.js',
                                        ],
                                    },
                                ]);
                            },
                        },
                    });
                });
            }
        }

        // loginController.$inject = ['authLoginService', '$state', '$uibModal', 'blockUI', 'toastr'];

        return directive;
    }
});
