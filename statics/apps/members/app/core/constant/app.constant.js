define(['appMember'], function () {
    'use strict';

    angular
        .module('appMember')
        .constant('DIRECTORY', {
            COMPONENTS: '/statics/apps/members/app/components',
            CORE: '/statics/apps/members/app/core',
            FACTORIES: '/statics/apps/members/app/factories',
            SERVICES: '/statics/apps/members/app/services',
            SHARED: '/statics/apps/members/app/shared',
            CSS: '/statics/apps/members/assets/css',
            FONTS: '/statics/apps/members/assets/fonts',
            IMG: '/statics/apps/members/assets/img',
            JS: '/statics/apps/members/assets/js',
            LIBS: '/statics/apps/members/assets/libs',
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
