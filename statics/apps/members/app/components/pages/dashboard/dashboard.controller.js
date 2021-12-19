define([], function () {
    'use strict';

    angular.module('appMember').controller('DashboardController', DashboardController);

    function DashboardController(DIRECTORY, $uibModal) {
        var vm = this;

        init();

        function init() {}
    }
});
