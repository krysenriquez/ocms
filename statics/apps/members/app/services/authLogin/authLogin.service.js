define(['urlFactory', 'identityFactory'], function () {
    'use strict';

    angular.module('auth.login', ['url.module', 'identity.module']).service('authLoginService', AuthLoginService);

    AuthLoginService.$inject = ['urlFactory', 'identityFactory'];

    function AuthLoginService($http, $location, $window, $timeout, $state, $q, UrlFactory, IdentityFactory) {
        this.login = login;
        // this.isLoggedIn = isLoggedIn;
        // this.logout = logout;
        // this.redirectIfNotLoggedIn = redirectIfNotLoggedIn;
        // this.setTitle = setTitle;
        function login(credentials) {
            console.log(IdentityFactory);
            return $http.post(UrlFactory.AUTH_MEMBER, credentials).then(function (response) {
                // localStorage.currentUserMember = JSON.stringify(response.data);
                console.log(IdentityFactory.getWhoAmI);
                var defer = $q.defer();
                // return appFactory.getCurrentUserInfo().then(function (data) {
                //     if (data.accountUser.length > 0) {
                //         var selectedMemberAccount = {
                //             accountId: data.accountUser[0].accountId,
                //         };
                //         localStorage.selectedMemberAccount = JSON.stringify(selectedMemberAccount);
                //         defer.resolve(true);
                //     } else {
                //         defer.resolve(false);
                //     }
                //     return defer.promise;
                // });
            });
        }

        // function isLoggedIn() {
        //     return !!localStorage.currentUserMember && !!localStorage.selectedMemberAccount;
        // }

        // function logout() {
        //     var user = JSON.parse(localStorage.getItem('currentUserMember'));
        //     var now = new Date();
        //     var userLogs = {
        //         user: user['id'],
        //         action_type: 'Logged Out',
        //         content_type: '',
        //         object_id: user['id'],
        //         object_type: 'User Account',
        //         apiLink: '/api/users/users',
        //         valueToDisplay: 'fullName',
        //         logDetails: [
        //             {
        //                 action: 'Logged out by ' + now,
        //             },
        //         ],
        //     };
        //     return appFactory.getContentTypeId('customuser').then(function (data) {
        //         userLogs.content_type = data;
        //         return $http.post('/api/users/userlogs/', userLogs).then(
        //             function () {
        //                 var baseUrl = new $window.URL($location.absUrl()).origin;
        //                 delete localStorage.currentUserMember;
        //                 delete localStorage.selectedMemberAccount;
        //                 $http.get(baseUrl + '/api/auth/logout/').then(function () {
        //                     $state.go('simple.login');
        //                 });
        //             },
        //             function (error) {
        //                 toastr.error(
        //                     'Error ' + error.status + ' ' + error.statusText,
        //                     'Could not record logs.  Please contact System Administrator'
        //                 );
        //             }
        //         );
        //     });
        // }

        // function redirectIfNotLoggedIn() {
        //     if (!isLoggedIn()) {
        //         $state.go('simple.login');
        //     }
        // }

        // function setTitle(newTitle) {
        //     $window.document.title = newTitle;
        // }
    }
});
