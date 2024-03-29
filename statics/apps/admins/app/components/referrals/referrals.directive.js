define(['appAdmin', 'ngTable', 'accountFactory'], function () {
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

        function referralsController($scope, $filter, $uibModal, accountFactory, NgTableParams, toastr) {
            var vm = this;
            vm.viewReferralDetails = viewReferralDetails;
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
                            return accountFactory
                                .getReferrals()
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

            function viewReferralDetails(account) {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/referrals/referralDetails/referralDetails.tpl.html',
                    size: 'lg',
                    controller: 'ReferralDetailsController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'ReferralDetailsController',
                                    files: [
                                        DIRECTORY.COMPONENTS +
                                            '/referrals/referralDetails/referralDetails.controller.js',
                                    ],
                                },
                            ]);
                        },
                        accountObject: function () {
                            return {
                                account: account,
                            };
                        },
                    },
                });
            }
        }

        function link(scope, elem, attrs) {}
    }
});
