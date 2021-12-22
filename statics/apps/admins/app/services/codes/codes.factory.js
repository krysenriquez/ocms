define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('codesFactory', codesFactory);

    function codesFactory($http, $q, urlService, humpsFactory) {
        return {
            verifyCode: verifyCode,
            getCodeStatus: getCodeStatus,
        };

        function verifyCode(data) {
            return $http({
                url: urlService.VERIFY_SPONSOR_CODE,
                method: 'POST',
                data: humpsFactory.decamelizeKeys(data),
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }

        function getCodeStatus(data) {
            return $http({
                url: urlService.GET_CODE_STATUS,
                method: 'POST',
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }
    }
});
