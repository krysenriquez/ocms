define([], function () {
    'use strict';

    angular.module('appMember').service('adsService', adsService);

    function adsService($window, $q) {
        this.openDirectLink = openDirectLink;

        function openDirectLink() {
            var deferred = $q.defer();
            deferred.resolve($window.open('//dooloust.net/4/4814462', '_blank'));
            return deferred.promise;
        }
    }
});
