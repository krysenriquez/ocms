define(['appAdmin'], (function () {
    'use strict';

    angular.module('appAdmin').directive('translate', translate);

    function translate($http, DIRECTORY, localStorageFactory, _, $compile) {
        return {
            restrict: 'A',
            link: link,
        };

        function link(scope, elem, attrs) {
            attrs.$observe('translate', function (translated) {
                $http({
                    url: DIRECTORY.STRINGS + '/strings.properties',
                    method: 'GET',
                }).then(function (response) {
                    var extractedProps = extractProperties(response.data);
                    localStorageFactory.put('strings', extractedProps);
                    var string = extractedProps[translated];
                    if (Boolean(string)) {
                        if (attrs.translateRequired) {
                            var html = '<span>' + string + '*</span>';
                        } else {
                            var html = '<span>' + string + '</span>';
                        }
                    } else {
                        if (attrs.translateCurrency) {
                            var html = '<span>' + translated + '</span>';
                        } else {
                            var html = '<span>' + translated + '</span>';
                        }
                    }
                    elem.html(html);
                });
                $compile(elem.contents())(scope);
            });

            function extractProperties(data) {
                var keyValuePairs = data.split('\n');
                var properties = {};
                for (var i = 0; i < keyValuePairs.length; i++) {
                    var keyValueArr = keyValuePairs[i].trim().split('=');
                    var key = keyValueArr[0];
                    var value = keyValueArr[1];
                    properties[key] = value;
                }
                return properties;
            }
        }
    }
})());
