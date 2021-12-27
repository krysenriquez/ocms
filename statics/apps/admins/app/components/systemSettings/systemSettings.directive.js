define(['appAdmin', 'ngTable', 'settingsFactory'], function () {
    'use strict';

    angular.module('appAdmin').directive('systemSettings', systemSettings);

    function systemSettings(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: SystemSettingsController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/systemSettings/systemSettings.tpl.html',
        };

        return directive;

        function SystemSettingsController($state, $filter, settingsFactory, toastr) {
            var vm = this;
            vm.updateSettings = updateSettings;

            init();

            function init() {
                generateDaysIsoFormat();
                getAdminSettings();
            }

            function getAdminSettings() {
                settingsFactory
                    .getAdminSettings()
                    .then(function (response) {
                        vm.settings = response;
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }

            function generateDaysIsoFormat() {
                vm.days = [
                    { day: 'Monday', value: 1 },
                    { day: 'Tuesday', value: 2 },
                    { day: 'Wednesday', value: 3 },
                    { day: 'Thursday', value: 4 },
                    { day: 'Friday', value: 5 },
                    { day: 'Saturday', value: 6 },
                    { day: 'Sunday', value: 7 },
                ];
            }

            function updateSettings() {
                settingsFactory
                    .updateAdminSettings(vm.settings)
                    .then(function (response) {
                        toastr.success(response.message);
                        $state.reload();
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }
        }

        function link(scope, elem, attrs) {}
    }
});
