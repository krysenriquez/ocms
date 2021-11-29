define(['appAdmin'], function () {
    'use strict';

    angular.module('appAdmin').provider('template', function (DIRECTORY) {
        this.$get = function () {
            return {};
        };

        this.getComponent = function (name) {
            return DIRECTORY.COMPONENTS + '/' + name + '/' + name + '.tpl.html';
        };

        this.getShared = function (name) {
            return DIRECTORY.SHARED + '/' + name + '/' + name + '.tpl.html';
        };
    });
});
