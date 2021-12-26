define(['appMember', 'statusFactory'], (function () {
    'use strict';

    angular.module('appMember').directive('buttonValidator', buttonValidator);

    function buttonValidator(statusFactory) {
        return {
            link: link,
            restrict: 'A',
        };

        function link(scope, elem, attrs) {
            scope.$watch(
                attrs.buttonValidator,
                function (newValue, oldValue) {
                    if (angular.isDefined(newValue) && newValue != oldValue) {
                        if (newValue) {
                            elem.removeAttr('disabled');
                        } else {
                            attrs.$set('disabled', 'disabled');
                        }
                    } else {
                        if (oldValue) {
                            elem.removeAttr('disabled');
                        } else {
                            attrs.$set('disabled', 'disabled');
                        }
                    }
                },
                true
            );
        }
    }
})());
