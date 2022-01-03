define(['appMember', 'activityFactory'], function () {
    'use strict';

    angular.module('appMember').directive('imaSdkPlayer', imaSdkPlayer).directive('myReplayPlugin', myReplayPlugin);

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

    function myReplayPlugin(DIRECTORY, accountFactory, activityFactory) {
        return {
            restrict: 'E',
            require: '^videogular',
            link: function (scope, elem, attrs, API) {
                scope.API = API;
                var accountId;
                scope.$watch(
                    function () {
                        return accountFactory.getSelectedAccount().accountId;
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            accountId = newValue;
                        } else {
                            accountId = oldValue;
                        }
                    }
                );

                scope.$watch(
                    'API.isCompleted',
                    function (newValue, oldValue) {
                        if (newValue) {
                            activityFactory
                                .createWatchAndEarn(accountId)
                                .then(function (response) {
                                    swal('Success!', response.message, 'success');
                                })
                                .catch(function (error) {
                                    toastr.error(error.data.message);
                                });
                        }
                    },
                    true
                );
            },
        };
    }
});
