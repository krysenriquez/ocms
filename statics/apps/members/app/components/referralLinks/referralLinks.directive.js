define(['appMember', 'ngTable', 'accountFactory'], function () {
    'use strict';

    angular.module('appMember').directive('referralLinks', referralLinks);

    function referralLinks(DIRECTORY) {
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
            NgTableParams,
            toastr
        ) {
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
                        loadTable();
                    }
                );
            }

            function loadTable() {
                vm.tableReferrals = new NgTableParams(
                    {
                        page: 1,
                        count: 20,
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
