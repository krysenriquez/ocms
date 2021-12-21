define(['appAdmin'], function () {
    'use strict';

    angular.module('appAdmin').directive('imaSdkPlayer', imaSdkPlayer).directive('myReplayPlugin', myReplayPlugin);

    function imaSdkPlayer(DIRECTORY) {
        var directive = {
            bindToController: true,
            replace: true,
            controller: imaSdkPlayerController,
            controllerAs: 'vm',
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
                    url: DIRECTORY.CSS + '/components/videogular-theme.css',
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
    }

    function myReplayPlugin(DIRECTORY) {
        return {
            restrict: 'E',
            require: '^videogular',
            link: function (scope, elem, attrs, API) {
                scope.API = API;
                scope.$watch(
                    'API.isCompleted',
                    function (newValue, oldValue) {
                        if (newValue) {
                            swal('Success!', 'You earned P0.05', 'success');
                        }
                    },
                    true
                );
            },
        };
    }
});
