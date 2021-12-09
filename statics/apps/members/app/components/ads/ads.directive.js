define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('googleAds', googleAds);

    function googleAds($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                return $timeout(function () {
                    var adsbygoogle, html, rand;
                    rand = Math.random();
                    html =
                        "<ins class='adsbygoogle' style='display:block' data-ad-client='ca-pub-5895141521130100' data-ad-slot='5336514247' data-ad-format='auto' data-full-width-responsive='true'></ins>";
                    $(elem).append(html);
                    return (adsbygoogle = window.adsbygoogle || []).push({});
                });
            },
        };
    }
});
