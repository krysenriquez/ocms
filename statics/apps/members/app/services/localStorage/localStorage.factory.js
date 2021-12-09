define(['appMember'], function () {
    'use strict';

    angular.module('appMember').factory('localStorageFactory', localStorageFactory);

    function localStorageFactory($window) {
        var localStorage = $window.localStorage;
        return {
            get: get,
            put: put,
            remove: remove,
            removeAll: removeAll,
        };

        function get(key) {
            var storedValue = localStorage.getItem(key);
            try {
                return angular.fromJson(storedValue);
            } catch {
                return undefined;
            }
        }

        function put(key, value) {
            return localStorage.setItem(key, angular.toJson(value));
        }

        function remove(key) {
            return localStorage.removeItem(key);
        }

        function removeAll() {
            localStorage.clear();
        }
    }
});
