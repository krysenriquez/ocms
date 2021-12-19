define(['appMember', 'statusFactory'], (function () {
    'use strict';

    angular.module('appMember').directive('inputValidator', inputValidator);

    function inputValidator(statusFactory) {
        return {
            link: link,
            restrict: 'A',
        };

        function link(scope, elem, attrs) {
            scope.$watch(
                attrs.inputValidator,
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
                        if (oldValue.status) {
                            if (statusFactory.isValidStatus(oldValue.status)) {
                                elem.removeClass('is-invalid');
                                elem.addClass('is-valid');
                            } else {
                                elem.removeClass('is-valid');
                                elem.addClass('is-invalid');
                            }
                        } else {
                            elem.removeClass('is-valid');
                            elem.addClass('is-invalid');
                        }
                    }
                },
                true
            );
        }
    }
})());
