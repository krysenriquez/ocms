define(['appAdmin'], function () {
    'use strict';

    var root = '/statics/apps/admins';

    angular
        .module('appAdmin')
        .constant('APPNAME', 'One Creations')
        .constant('LOGO', {
            NAVLOGO: '/statics/media/img/nav_logo.png',
            APPLOGO: '/statics/media/img/logo.png',
            IMALOGO: '/statics/media/img/ima_logo.png',
        })
        .constant('DIRECTORY', {
            COMPONENTS: root + '/app/components',
            CORE: root + '/app/core',
            FACTORIES: root + '/app/factories',
            SERVICES: root + '/app/services',
            SHARED: root + '/app/shared',
            CSS: root + '/assets/css',
            FONTS: root + '/assets/fonts',
            IMG: root + '/assets/img',
            JS: root + '/assets/js',
            LIBS: root + '/assets/libs',
            MEDIA: '/statics/media',
            STRINGS: root + '/app/strings',
        })
        .constant('IMA', {
            MP4: 'https://storage.googleapis.com/interactive-media-ads/media/android.mp4',
            WEBM: 'https://storage.googleapis.com/interactive-media-ads/media/android.webm',
        });
});
