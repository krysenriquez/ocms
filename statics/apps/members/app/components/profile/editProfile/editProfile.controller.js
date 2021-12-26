define([
    'codesFactory',
    'messageValidator',
    'inputValidator',
    'formValidator',
    'buttonValidator',
    'minLengthValidator',
    'userFactory',
    'verifyFactory',
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
        statusFactory
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
            console.log(vm.edit);
        }

        function save() {
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
        }

        function cancel() {
            $uibModalInstance.close();
        }
    }
});
