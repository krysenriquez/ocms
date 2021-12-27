define(['localStorageFactory', 'urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('settingsFactory', settingsFactory);

    function settingsFactory($q, $http, urlService, humpsFactory, _) {
        var data = [];

        return {
            getWallets: getWallets,
            getAdminSettings: getAdminSettings,
            updateAdminSettings: updateAdminSettings,
        };

        function getWallets() {
            return $http({
                url: urlService.GET_WALLETS,
                method: 'POST',
            }).then(
                function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data);
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function getAdminSettings() {
            return $http({
                url: urlService.GET_SETTINGS,
                method: 'GET',
            }).then(
                function (response) {
                    var responseData = preProcessSettings(humpsFactory.camelizeKeys(response.data));
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function updateAdminSettings(data) {
            return $http({
                url: urlService.UPDATE_SETTINGS,
                method: 'POST',
                data: postProcessSettings(data),
            }).then(
                function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data);
                    return $q.resolve(responseData);
                },
                function (error) {
                    return $q.reject(error);
                }
            );
        }

        function preProcessSettings(response) {
            return _.reduce(
                response,
                function (result, value, key) {
                    result[value.property] = parseFloat(value.value);
                    return result;
                },
                {}
            );
        }

        function postProcessSettings(response) {
            var arr = [];
            _.map(response, function (value, key) {
                arr.push({
                    property: key,
                    value: value,
                });
            });
            return arr;
        }
    }
});
