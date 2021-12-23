define(['appMember', 'ngTable', 'accountFactory'], function () {
    'use strict';

    angular.module('appMember').directive('activationCodes', activationCodes);

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

        function activationCodesController($scope, $filter, accountFactory, NgTableParams, toastr) {
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
                        loadActivationCodesTable();
                    }
                );
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
                                .getAccountCodes(accountId)
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
