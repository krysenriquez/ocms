define(['appAdmin', 'ngTable', 'accountFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('activationCodes', activationCodes);

    function activationCodes(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: activationCodesController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/activationCodes/activationCodes.tpl.html',
        };

        return directive;

        function activationCodesController($scope, $filter, $uibModal, accountFactory, NgTableParams, toastr) {
            var vm = this;
            vm.generateCode = generateCode;
            var accountId;
            init();

            function init() {
                loadActivationCodesTable();
            }

            function loadActivationCodesTable() {
                vm.activationCodesTable = new NgTableParams(
                    {
                        page: 1,
                        count: 10,
                    },
                    {
                        counts: [10, 20, 30, 50, 100],
                        getData: function (params) {
                            return accountFactory
                                .getAccountCodes()
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

            function generateCode() {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/activationCodes/generateCode/generateCode.tpl.html',
                    size: 'lg',
                    controller: 'GenerateCodeController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'GenerateCodeController',
                                    files: [
                                        DIRECTORY.COMPONENTS +
                                            '/activationCodes/generateCode/generateCode.controller.js',
                                    ],
                                },
                            ]);
                        },
                    },
                });
            }
        }

        function link(scope, elem, attrs) {}
    }
});
