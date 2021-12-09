define([], function () {
    'use strict';

    angular.module('appMember').service('accountService', accountService);

    function accountService($http, urlService, humpsFactory) {
        this.getAccountAvatar = getAccountAvatar;

        function getAccountAvatar() {
            $http({
                url: urlService.ACCOUNT_AVATAR,
                method: 'GET',
            }).then(function (response) {
                var responseData = humpsFactory.camelizeKeys(response.data[0]);
            });
        }
    }
});
