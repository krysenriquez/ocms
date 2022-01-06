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

        function imaSdkPlayerController($scope, $sce, IMA, LOGO, DIRECTORY, accountFactory, activityFactory, toastr) {
            var vm = this;
            var accountId;
            init();

            function init() {
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

                vm.mp4 = $sce.trustAsResourceUrl(IMA.MP4);
                vm.media = {
                    sources: [
                        // {
                        //     src: $sce.trustAsResourceUrl(IMA.MP4),
                        //     type: 'video/mp4',
                        // },
                        // {
                        //     src: $sce.trustAsResourceUrl(IMA.WEBM),
                        //     type: 'video/webm',
                        // },
                    ],
                    poster: LOGO.IMALOGO,
                };

                vm.setup = {
                    aspectRatio: '16:9',
                    controlBar: { progressControl: true },
                    plugins: {
                        vastClient: {
                            adTagUrl:
                                'https://www.videosprofitnetwork.com/watch.xml?key=064f4d07d4665c3b132231eaabb98802',
                            adsCancelTimeout: 3000,
                            adsEnabled: true,
                            preferredTech: 'html5',
                        },
                    },
                };
            }

            // $scope.$on('vjsVideoReady', function (e, data) {
            //     data.player.plugins = {
            //         ads: {},
            //         vast: {
            //             url: 'https://www.videosprofitnetwork.com/watch.xml?key=064f4d07d4665c3b132231eaabb98802',
            //         },
            //     };
            // });

            $scope.$on('vjsVideoEnded', function (e, data) {
                activityFactory
                    .createWatchAndEarn(accountId)
                    .then(function (response) {
                        swal('Success!', response.message, 'success');
                    })
                    .catch(function (error) {
                        toastr.error(error.data.message);
                    });
            });
        }

        function link(scope, elem, attrs) {}
    }
});
