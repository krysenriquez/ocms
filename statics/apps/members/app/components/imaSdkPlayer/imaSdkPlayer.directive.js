define(['appMember', 'activityFactory'], function () {
    'use strict';

    angular.module('appMember').directive('imaSdkPlayer', imaSdkPlayer);

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

        function imaSdkPlayerController(
            $scope,
            $state,
            $window,
            $http,
            $sce,
            LOGO,
            VAST,
            DIRECTORY,
            accountFactory,
            activityFactory,
            toastr
        ) {
            const watch = document.getElementById('watch-and-earn');
            var vm = this;
            vm.shouldDisableClaim = true;
            vm.claim = claim;
            var accountId;
            var player;

            var startEvent = 'click';
            if (
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/Android/i)
            ) {
                var startEvent = 'touchend';
            }

            init();

            function init() {
                vm.poster = LOGO.IMALOGO;
                vm.clickCounter = 0;
                $scope.$watch(
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
                if (watch) {
                    player = videojs(watch, {
                        sources: [
                            {
                                src: 'https://storage.googleapis.com/gvabox/media/samples/android.mp4',
                                type: 'video/mp4',
                            },
                        ],
                        aspectRatio: '16:9',
                        controlBar: {
                            playToggle: false,
                            captionsButton: false,
                            chaptersButton: false,
                            subtitlesButton: false,
                            remainingTimeDisplay: false,
                            progressControl: {
                                seekBar: false,
                            },
                            fullscreenToggle: false,
                            playbackRateMenuButton: false,
                            pictureInPictureToggle: false,
                        },
                        controls: true,
                        poster: LOGO.IMALOGO,
                    });

                    var options = {
                        // adTagUrl: $window.location.origin + VAST.XML,
                        adTagUrl: 'https://www.videosprofitnetwork.com/watch.xml?key=064f4d07d4665c3b132231eaabb98802',
                        adsManagerLoadedCallback: adsManager,
                    };

                    player.ima(options);
                    watch.addEventListener(startEvent, initialize);
                }
            }

            player.on('adsready', function (response) {
                toastr.success('Ads Loaded.');
            });

            player.on('adserror', function (response) {
                toastr.error('No Ads loaded.');
                swal('Error!', 'No Ads Loaded. Refresh the player?', 'error').then(function (response) {
                    $state.reload();
                });
            });

            function initialize() {
                player.ima.initializeAdDisplayContainer();
                console.log('intialize');
                watch.removeEventListener(startEvent, initialize);
            }

            function adsManager() {
                var events = [
                    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.COMPLETE,
                    google.ima.AdEvent.Type.FIRST_QUARTILE,
                    google.ima.AdEvent.Type.LOADED,
                    google.ima.AdEvent.Type.MIDPOINT,
                    google.ima.AdEvent.Type.PAUSED,
                    google.ima.AdEvent.Type.RESUMED,
                    google.ima.AdEvent.Type.STARTED,
                    google.ima.AdEvent.Type.THIRD_QUARTILE,
                ];

                for (var index = 0; index < events.length; index++) {
                    player.ima.addEventListener(events[index], adEvent);
                }
            }

            function adEvent(event) {
                if (event.type == 'click') {
                    incrementCounter();
                }
                if (event.type == 'allAdsCompleted' || event.type == 'complete') {
                    validateClaimButton();
                }
            }

            function incrementCounter() {
                $scope.$apply(function () {
                    vm.clickCounter += 1;
                });
            }

            function validateClaimButton() {
                if (vm.clickCounter >= 3) {
                    $scope.$apply(function () {
                        vm.shouldDisableClaim = false;
                    });
                } else {
                    swal('Error!', 'Number of Clicks not Reached. Refresh the player?', 'error').then(function (
                        response
                    ) {
                        $state.reload();
                    });
                }
            }

            function createWatchActivity() {
                vm.shouldDisableClaim = true;
                activityFactory
                    .createWatchAndEarn(accountId)
                    .then(function (response) {
                        swal('Success!', response.message, 'success').then(function (response) {
                            $state.reload();
                        });
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            }

            function claim() {
                if (Boolean(vm.shouldDisableClaim) == false && vm.clickCounter >= 3) {
                    createWatchActivity();
                }
            }
        }

        function link(scope, elem, attrs) {}
    }
});
