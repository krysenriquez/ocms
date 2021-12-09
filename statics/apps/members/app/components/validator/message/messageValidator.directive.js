define(['appMember', 'statusFactory'], (function () {
    'use strict';

    angular.module('appMember').directive('messageValidator', messageValidator);

    function messageValidator(statusFactory) {
        return {
            replace: true,
            link: link,
            restrict: 'E',
            template: `<div>{{ message }}</div>`,
        };

        function link(scope, elem, attrs) {
            scope.$watch(
                attrs.validator,
                function (newValue, oldValue) {
                    if (newValue) {
                        if (statusFactory.isValidStatus(newValue.status)) {
                            console.log(newValue);
                            elem.removeClass('invalid-feedback');
                            elem.addClass('valid-feedback');
                            scope.message = newValue.message;
                        } else {
                            elem.removeClass('valid-feedback');
                            elem.addClass('invalid-feedback');
                            scope.message = newValue.message;
                        }
                    }
                },
                true
            );
        }
    }
})());
