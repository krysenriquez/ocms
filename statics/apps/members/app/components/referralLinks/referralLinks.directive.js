define(['appMember', 'ngTable'], function () {
    'use strict';

    angular.module('appMember').directive('referralLinks', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: referralLinksController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/referralLinks/referralLinks.tpl.html',
            scope: {},
        };

        return directive;

        function referralLinksController(
            $scope,
            $http,
            $filter,
            accountFactory,
            urlService,
            humpsFactory,
            NgTableParams
        ) {
            var vm = this;

            init();

            function init() {
                $scope.$watch(
                    function () {
                        return accountFactory.getAccountId();
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            vm.accountId = newValue;
                        } else {
                            vm.accountId = oldValue;
                        }
                        loadTable();
                    }
                );

                function loadTable() {
                    vm.tableReferrals = new NgTableParams(
                        {
                            page: 1,
                            count: 20,
                        },
                        {
                            counts: [10, 20, 30, 50, 100],
                            getData: function (params) {
                                return $http({
                                    url: urlService.CODES,
                                    method: 'GET',
                                    params: { account_id: vm.accountId },
                                }).then(
                                    function (response) {
                                        var obj = humpsFactory.camelizeKeys(response.data);
                                        var filteredData = params.filter()
                                            ? $filter('filter')(obj, params.filter())
                                            : obj;
                                        var orderedData = params.sorting()
                                            ? $filter('orderBy')(filteredData, params.orderBy())
                                            : filteredData;
                                        var page = orderedData.slice(
                                            (params.page() - 1) * params.count(),
                                            params.page() * params.count()
                                        );
                                        params.total(obj.length);
                                        var page = orderedData.slice(
                                            (params.page() - 1) * params.count(),
                                            params.page() * params.count()
                                        );
                                        console.log(page);
                                        return page;
                                    },
                                    function (error) {
                                        console.log(error);
                                    }
                                );
                            },
                        }
                    );
                }
            }
        }

        function link(scope, elem, attrs) {}
    });
});
