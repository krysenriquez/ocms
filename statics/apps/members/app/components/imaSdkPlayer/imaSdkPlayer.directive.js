define([
    'appMember',
    'adsService',
    'activityFactory',
    'videojs',
    'videojsAds',
    'videojsIma',
    'videojsYoutube',
], function () {
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

        function imaSdkPlayerController($scope, $state, LOGO, accountFactory, activityFactory, adsService, toastr) {
            const watch = document.getElementById('watch-and-earn');
            var vm = this;
            vm.shouldDisableClaim = true;
            vm.claim = claim;
            vm.triggerClick = triggerClick;
            var accountId;
            var player;
            var ended;
            var clicked;

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
                clicked = false;
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
                        techOrder: ['youtube'],
                        sources: [{ type: 'video/youtube', src: 'https://youtu.be/CzixrfYq7us' }],
                        aspectRatio: '16:9',
                        controlBar: {
                            playToggle: true,
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
                        adTagUrl: 'https://www.videosprofitnetwork.com/watch.xml?key=064f4d07d4665c3b132231eaabb98802',
                        adsManagerLoadedCallback: adsManager,
                    };

                    player.ima(options);
                    watch.addEventListener(startEvent, initialize);
                }
            }

            player.on('ended', function (response) {
                ended = true;
                triggerClick();
            });

            function initialize() {
                player.ima.initializeAdDisplayContainer();
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

            function adEvent(event) {}

            function triggerClick() {
                adsService.openDirectLink().then(function (response) {
                    clicked = true;
                    validateClaimButton();
                });
            }

            function validateClaimButton() {
                if (ended && clicked) {
                    vm.shouldDisableClaim = false;
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
                if (Boolean(vm.shouldDisableClaim) == false) {
                    adsService.openDirectLink().then(function (response) {
                        createWatchActivity();
                    });
                }
            }
        }

        function link(scope, elem, attrs) {}
    }
});
