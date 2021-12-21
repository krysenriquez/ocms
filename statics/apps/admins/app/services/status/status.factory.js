define([], function () {
    'use strict';

    angular.module('appAdmin').service('statusFactory', statusFactory);

    function statusFactory() {
        return {
            OK: 200,
            CREATED: 201,
            ACCEPTED: 202,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            CONFLICT: 409,
            GONE: 410,
            isInvalidStatus: isInvalidStatus,
            isValidStatus: isValidStatus,
        };

        function isInvalidStatus(statusCode) {
            return statusCode.toString().charAt(0) === '4';
        }

        function isValidStatus(statusCode) {
            return statusCode.toString().charAt(0) === '2';
        }
    }
});
