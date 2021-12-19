define(['appMember', 'statusFactory'], (function () {
    'use strict';

    angular.module('appMember').directive('messageValidator', messageValidator);

    function messageValidator(statusFactory) {
        return {
            link: link,
            restrict: 'E',
            template: `<div></div>`,
        };

        function link(scope, elem, attrs) {
            scope.$watch(
                attrs.validator,
                function (newValue) {
                    if (newValue) {
                        if (statusFactory.isValidStatus(newValue.status)) {
                            elem.removeClass('invalid-feedback');
                            elem.addClass('valid-feedback');
                            elem.html(newValue.message);
                        } else {
                            elem.removeClass('valid-feedback');
                            elem.addClass('invalid-feedback');
                            elem.html(newValue.message);
                        }
                    }
                },
                true
            );
        }
    }
})());
