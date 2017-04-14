/**
 * @fileoverview 分享页，js入口
 * @authors liyifei@le.com
 * @date 2017/04
 */
define('conf/share-m', function(require, exports, module) {
    window.$ = require('zepto');
    // 业务代码
    var share = require('mods/global/share');
    share.init();
    // 数据统计
    require('mods/mobile/analytics');
});
