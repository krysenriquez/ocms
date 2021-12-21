define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appAdmin').factory('userFactory', userFactory);

    function userFactory(localStorageFactory) {
        var data = [];

        return {
            getUser: getUser,
            setUser: setUser,
        };

        function getUser() {
            return data.user;
        }

        function setUser(user) {
            localStorageFactory.put('user', user);
            data.user = user;
        }
    }
});
