define(['appMember'], (function () {
    'use strict';

    angular.module('appMember').filter('initials', initials);

    function initials() {
        return function (input) {
            if (input) {
                return input
                    .split(/[\s+\_+]/)
                    .map((s) => s.charAt(0).toLocaleUpperCase())
                    .join('');
            }
            return input;
        };
    }
})());
