define([], function () {
    'use strict';

    angular.module('appMember').service('statusService', function () {
        this.OK = 200;
        this.CREATED = 201;
        this.ACCEPTED = 202;
        this.BAD_REQUEST = 400;
        this.UNAUTHORIZED = 401;
        this.FORBIDDEN = 403;
        this.NOT_FOUND = 404;
    });
});
