define(['appMember', 'ngTable', 'accountFactory', 'cashoutFactory'], function () {
    'use strict';

    angular.module('appMember').directive('profile', profile);

    function profile(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: profileController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/profile/profile.tpl.html',
        };

        return directive;

        function profileController($scope, $filter, $uibModal, accountFactory, cashoutFactory, NgTableParams, toastr) {
            var vm = this;
            var accountId;
            vm.editProfile = editProfile;
            vm.blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
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
                        getProfile(accountId);
                    }
                );
            }

            function getProfile(accountId) {
                accountFactory
                    .getProfile(accountId)
                    .then(function (response) {
                        if (response) {
                            vm.profile = response;
                        }
                    })
                    .catch(function (error) {
                        toastr.error(error);
                    });
            }

            function editProfile() {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/profile/editProfile/editProfile.tpl.html',
                    size: 'xl',
                    controller: 'EditProfileController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'EditProfileController',
                                    files: [DIRECTORY.COMPONENTS + '/profile/editProfile/editProfile.controller.js'],
                                },
                            ]);
                        },
                        profileObject: function () {
                            return vm.profile;
                        },
                    },
                });
            }
        }

        function link(scope, elem, attrs) {}
    }
});
