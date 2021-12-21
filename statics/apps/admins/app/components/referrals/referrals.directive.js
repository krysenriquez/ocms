define(['appAdmin', 'ngTable', 'activityFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('referrals', referrals);

    function referrals(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: referralsController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/referrals/referrals.tpl.html',
        };

        return directive;

        function referralsController($scope, $filter, activityFactory, NgTableParams, toastr) {
            var vm = this;

            init();

            function init() {
                loadReferralsTable();
            }

            function loadReferralsTable() {
                vm.referralsTable = new NgTableParams(
                    {
                        page: 1,
                        count: 10,
                    },
                    {
                        counts: [10, 20, 30, 50, 100],
                        getData: function (params) {
                            return activityFactory
                                .getActivitySummary(activityFactory.DIRECT_REFERRAL)
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
