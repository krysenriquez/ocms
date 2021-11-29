define(['appMember'], function () {
    'use strict';

    angular.module('appMember').directive('imaSdkPlayer', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: imaSdkPlayerController,
            controllerAs: 'ima',
            link: link,
            restrict: 'E',
            templateUrl: DIRECTORY.COMPONENTS + '/imaSdkPlayer/imaSdkPlayer.tpl.html',
            scope: {},
        };

        return directive;

        function imaSdkPlayerController($sce, IMA, LOGO, DIRECTORY) {
            var vm = this;

            init();

            function init() {
                vm.mp4 = $sce.trustAsResourceUrl(IMA.MP4);
                vm.webm = $sce.trustAsResourceUrl(IMA.WEBM);
            }

            vm.config = {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl(IMA.MP4),
                        type: 'video/mp4',
                    },
                    {
                        src: $sce.trustAsResourceUrl(IMA.WEBM),
                        type: 'video/webm',
                    },
                ],
                theme: {
                    url: DIRECTORY.CSS + '/videogular-theme.css',
                },
                plugins: {
                    poster: LOGO.IMALOGO,
                    ads: {
                        companion: 'companionAd',
                        companionSize: [728, 90],
                        network: '6062',
                        unitPath: 'iab_vast_samples',
                        adTagUrl: $sce.trustAsResourceUrl(
                            'http://ad3.liverail.com/?LR_PUBLISHER_ID=1331&LR_CAMPAIGN_ID=229&LR_SCHEMA=vast2'
                        ),
                        skipButton: "<div class='skipButton'>skip ad</div>",
                    },
                },
            };
        }

        function link(scope, elem, attrs) {}
    });
});
