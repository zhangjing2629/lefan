define('conf/userinfo-m', function(require, exports, module) {
    window.$ = require('zepto');

    // 通用
    // 分享
    var share = require('mods/global/share');
    share.init();

    // 业务代码
    require('lib/mobiscroll/mobiscroll-core');
    require('lib/mobiscroll/mobiscroll-frame');
    require('lib/mobiscroll/mobiscroll-scroller');
    require('lib/mobiscroll/mobiscroll.util-datetime');
    require('lib/mobiscroll/mobiscroll-datetimebase');
    require('lib/mobiscroll/mobiscroll-datetime');
    require('lib/mobiscroll/mobiscroll-listbase');
    require('lib/mobiscroll/mobiscroll-treelist');
    require('lib/mobiscroll/mobiscroll-frame.ios');
    require('lib/mobiscroll/mobiscroll-setting');
    require('mods/mobile/userinfo');
    // 数据统计
    require('mods/mobile/analytics');
});
