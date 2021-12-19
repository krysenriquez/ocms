define(['appMember'], (function () {
    'use strict';

    angular.module('appMember').directive('formValidator', formValidator);

    function formValidator() {
        return {
            link: link,
            restrict: 'A',
        };

        function link(scope, elem, attrs) {
            // scope.$watch(
            //     attrs.formValidator,
            //     function (newValue, oldValue) {
            //         if (angular.isDefined(newValue) && newValue != oldValue) {
            //             if (newValue.$valid) {
            //                 elem.removeAttr('disabled');
            //             } else {
            //                 elem.attr('disabled', 'disabled');
            //             }
            //         }
            //     },
            //     true
            // );
        }
    }
})());
