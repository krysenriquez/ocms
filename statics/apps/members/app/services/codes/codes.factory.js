define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('codesFactory', codesFactory);

    function codesFactory($http, $q, urlService, humpsFactory) {
        return {
            verifyCode: verifyCode,
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
    }
});
