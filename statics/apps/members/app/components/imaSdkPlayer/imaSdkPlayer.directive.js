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

        function imaSdkPlayerController($scope, $state, $sce, LOGO, IMA, accountFactory, activityFactory, toastr) {
            var vm = this;
            var accountId;
            var player;
            init();

            function init() {
                vm.poster = LOGO.IMALOGO;
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
                const watch = document.getElementById('watch-and-earn');
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
                        adTagUrl: 'https://www.videosprofitnetwork.com/watch.xml?key=064f4d07d4665c3b132231eaabb98802',
                    };

                    player.ima(options);

                    player.on('adend', function (response) {
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
                    });

                    player.on('adtimeout ', function (response) {
                        toastr.error('No Ads loaded.');
                        swal('Error!', 'No Ads Loaded. Refreshing Player.', 'error').then(function (response) {
                            $state.reload();
                        });
                    });
                }
            }
        }

        function link(scope, elem, attrs) {}
    }
});
