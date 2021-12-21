define(['appAdmin', 'statusFactory'], (function () {
    'use strict';

    angular.module('appAdmin').directive('buttonValidator', buttonValidator);

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
                        if (newValue.status) {
                            if (statusFactory.isValidStatus(newValue.status)) {
                                elem.removeClass('is-invalid');
                                elem.addClass('is-valid');
                            } else {
                                elem.removeClass('is-valid');
                                elem.addClass('is-invalid');
                            }
                        } else {
                            if (newValue != null) {
                                elem.removeClass('is-invalid');
                                elem.addClass('is-valid');
                            } else {
                                elem.removeClass('is-valid');
                                elem.addClass('is-invalid');
                            }
                        }
                    } else if (oldValue) {
                        console.log(oldValue);
                        elem.removeClass('is-valid');
                        elem.addClass('is-invalid');
                    }
                },
                true
            );
        }
    }
})());
