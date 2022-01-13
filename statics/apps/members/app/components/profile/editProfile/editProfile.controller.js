define([
    'codesFactory',
    'messageValidator',
    'inputValidator',
    'formValidator',
    'buttonValidator',
    'minLengthValidator',
    'userFactory',
    'verifyFactory',
    'adsService',
], function () {
    'use strict';

    angular.module('appMember').controller('EditProfileController', EditProfileController);

    function EditProfileController(
        $state,
        $uibModalInstance,
        profileObject,
        codesFactory,
        toastr,
        userFactory,
        accountFactory,
        verifyFactory,
        statusFactory,
        adsService
    ) {
        var vm = this;
        vm.save = save;
        vm.cancel = cancel;
        vm.new = {};
        vm.form = { profileForm: {} };
        vm.validation = {};

        init();

        function init() {
            vm.edit = profileObject;
        }

        function save() {
            adsService.openDirectLink().then(function (response) {
                accountFactory
                    .createAccount(vm.new)
                    .then(function (response) {
                        toastr.success(response.message);
                        $uibModalInstance.close();
                        $state.reload();
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            });
        }

        function cancel() {
            $uibModalInstance.close();
        }
    }
});
