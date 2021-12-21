define([], function () {
    'use strict';

    angular.module('appAdmin').controller('DashboardController', DashboardController);

    function DashboardController(DIRECTORY, $uibModal) {
        var vm = this;

        init();

        function init() {}
    }
});
