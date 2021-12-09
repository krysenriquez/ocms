define(['appMember'], function () {
    'use strict';

    angular.module('appMember').provider('$template', TemplateProvider);

    function TemplateProvider(DIRECTORY) {
        this.$get = function () {
            return {};
        };

        this.getComponent = function (name) {
            return DIRECTORY.COMPONENTS + '/' + name + '/' + name + '.tpl.html';
        };

        this.getShared = function (name) {
            return DIRECTORY.SHARED + '/' + name + '/' + name + '.tpl.html';
        };
    }
});
