define([], function () {
    'use strict';

    angular.module('appMember').controller('TermsAndConditionsController', TermsAndConditionsController);

    function TermsAndConditionsController($uibModalInstance) {
        var vm = this;
        vm.cancel = cancel;
        init();

        function init() {}

        function cancel() {
            $uibModalInstance.close();
        }
    }
});
