define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('verifyFactory', verifyFactory);

    function verifyFactory($http, $q, urlService, humpsFactory) {
        return {
            verifyUsername: verifyUsername,
            verifyEmailAddress: verifyEmailAddress,
            verifyPassword: verifyPassword,
        };

        function verifyUsername(params) {
            var data = humpsFactory.decamelizeKeys(params);
            return $http({
                url: urlService.VERIFY_USERNAME,
                method: 'POST',
                data: data,
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }

        function verifyEmailAddress(params) {
            var data = humpsFactory.decamelizeKeys(params);
            return $http({
                url: urlService.VERIFY_EMAIL_ADDRESS,
                method: 'POST',
                data: data,
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }

        function verifyPassword(params) {
            var data = humpsFactory.decamelizeKeys(params);
            return $http({
                url: urlService.VERIFY_PASSWORD,
                method: 'POST',
                data: data,
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
