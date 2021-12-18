define(['urlService', 'humpsFactory'], function () {
    'use strict';

    angular.module('appMember').factory('userFactory', userFactory);

    function userFactory($http, $q, urlService, humpsFactory, DIRECTORY) {
        return {
            getUserAccounts: getUserAccounts,
            getRemainingUserAccountCount: getRemainingUserAccountCount,
        };

        function fetchUserAccounts() {
            return $http({
                url: urlService.GET_USER_ACCOUNTS,
                method: 'GET',
            })
                .then(function (response) {
                    var responseData = humpsFactory.camelizeKeys(response.data[0]);
                    return $q.resolve(responseData);
                })
                .catch(function (error) {
                    return $q.reject(error);
                });
        }

        function getRemainingUserAccountCount() {
            return fetchUserAccounts()
                .then(function (response) {
                    return response.remaining;
                })
                .catch(function (error) {
                    toastr.error('Could not fetch User Accounts');
                });
        }

        function getUserAccounts() {
            return fetchUserAccounts()
                .then(function (response) {
                    var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                    var userAccounts = [];
                    _.map(response.accountUser, function (account) {
                        userAccounts.push({
                            accountId: account.accountId,
                            accountName: account.accountName,
                            accountNumber: account.accountNumber,
                            avatar:
                                account.avatarInfo.length > 0 && account.avatarInfo[0].fileAttachment
                                    ? account.avatarInfo[0].fileAttachment
                                    : blankAvatar,
                        });
                    });
                    return userAccounts;
                })
                .catch(function (error) {
                    toastr.error('Could not fetch User Accounts');
                });
        }
    }
});
