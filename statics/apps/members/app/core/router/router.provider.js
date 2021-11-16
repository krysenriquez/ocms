define(['routerModule'], function () {
    'use strict';

    angular.module('router.module').provider('routerHelperProvider', RouterHelperProvider);

    RouterHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider'];

    function RouterHelperProvider($locationProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        this.$get = routerHelper;

        $ocLazyLoadProvider.config({
            debug: true,
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
        });

        routerHelper.$inject = ['$state'];

        function routerHelper($state) {
            var hasOtherwise = false;

            var service = {
                configureStates: configureStates,
                getStates: getStates,
            };

            return service;

            function configureStates(states, otherwisePath) {
                states.forEach(function (state) {
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function getStates() {
                return $state.get();
            }
        }
    }
});
