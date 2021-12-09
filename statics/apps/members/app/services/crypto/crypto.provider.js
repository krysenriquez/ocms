define(['appMember', 'urlService'], function () {
    'use strict';

    angular.module('appMember').provider('$crypto', CryptoKeyProvider);

    function CryptoKeyProvider() {
        this.$get = CryptoKey;

        function CryptoKey($http, $q, urlService) {
            var cryptoKey;

            return {
                encrypt: encrypt,
                decrypt: decrypt,
                setKey: setKey,
            };

            function setKey() {
                return $http({
                    url: urlService.AUTH_GET,
                    method: 'POST',
                })
                    .then(function (response) {
                        cryptoKey = response.data.response;
                    })
                    .catch(function (error) {
                        return $q.reject(error);
                    });
            }

            function encrypt(message, key) {
                if (key === undefined) {
                    key = cryptoKey;
                }

                return CryptoJS.AES.encrypt(message, key).toString();
            }

            function decrypt(message, key) {
                if (key === undefined) {
                    key = cryptoKey;
                }

                return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
            }
        }
    }
});
