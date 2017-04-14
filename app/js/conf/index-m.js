/**
 * @fileoverview 签到，js入口
 * @authors liujie7@le.com
 * @date 2017/02
 */
define('conf/index-m', function(require, exports, module) {
    window.$ = require('zepto');
    // 通用
    // 分享
    var share = require('mods/global/share');
    share.init();
    // 业务代码
    require('mods/mobile/qiandao');
    // 数据统计
    require('mods/mobile/analytics');
});
