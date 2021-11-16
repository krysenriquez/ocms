define([], function () {
    'use strict';

    angular.module('directory.module', []).factory('directoryFactory', DirectoryFactory);

    function DirectoryFactory() {
        var exports = [];

        exports.BASE_DIR = '/statics/apps/members';
        exports.APP_ROOT = exports.BASE_DIR + '/app';
        exports.ASSETS_ROOT = exports.BASE_DIR + '/assets';

        exports.COMPONENTS = exports.APP_ROOT + '/components';
        exports.CORE = exports.APP_ROOT + '/core';
        exports.SHARED = exports.APP_ROOT + '/shared';

        exports.CSS = exports.ASSETS_ROOT + '/css';
        exports.FONTS = exports.ASSETS_ROOT + '/fonts';
        exports.LIBS = exports.ASSETS_ROOT + '/libs';
        exports.JS = exports.ASSETS_ROOT + '/js';

        return exports;
    }
});
