define(['appAdmin'], function () {
    'use strict';

    angular
        .module('appAdmin')
        .constant('DIRECTORY', {
            COMPONENTS: '/statics/apps/admins/app/components',
            CORE: '/statics/apps/admins/app/core',
            FACTORIES: '/statics/apps/admins/app/factories',
            SERVICES: '/statics/apps/admins/app/services',
            SHARED: '/statics/apps/admins/app/shared',
            CSS: '/statics/apps/admins/assets/css',
            FONTS: '/statics/apps/admins/assets/fonts',
            IMG: '/statics/apps/admins/assets/img',
            JS: '/statics/apps/admins/assets/js',
            LIBS: '/statics/apps/admin/assets/libs',
            MEDIA: '/statics/media',
        })
        .constant('APPNAME', 'One Creations')
        .constant('LOGO', {
            NAVLOGO: '/statics/media/img/nav_logo.png',
            APPLOGO: '/statics/media/img/logo.png',
            IMALOGO: '/statics/media/img/ima_logo.png',
        })
        .constant('IMA', {
            MP4: 'https://storage.googleapis.com/interactive-media-ads/media/android.mp4',
            WEBM: 'https://storage.googleapis.com/interactive-media-ads/media/android.webm',
        });
});