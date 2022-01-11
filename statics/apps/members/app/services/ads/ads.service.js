define([], function () {
    'use strict';

    angular.module('appMember').service('adsService', adsService);

    function adsService($window, $q) {
        this.openDirectLink = openDirectLink;

        function openDirectLink() {
            var deferred = $q.defer();
            deferred.resolve(
                $window.open(
                    'https://presumptuousfunnelinsight.com/gq730f2qk?key=61d8b9f4f6bf85d4f7c25d62edf5655d',
                    '_blank'
                )
            );
            return deferred.promise;
        }
    }
});
