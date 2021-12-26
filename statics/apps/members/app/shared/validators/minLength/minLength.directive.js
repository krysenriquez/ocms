define(['appMember', 'statusFactory'], (function () {
    'use strict';

    angular.module('appMember').directive('minLength', minLength);

    function minLength(statusFactory) {
        return {
            link: link,
            restrict: 'A',
            require: 'ngModel',
        };

        function link(scope, elem, attrs, ngModel) {
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue != oldValue) {
                    if (newValue.length < attrs.minLength) {
                    }
                }
            });
        }
    }
})());
