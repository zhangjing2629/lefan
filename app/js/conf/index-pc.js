/**
 * @fileoverview 签到，js入口
 * @authors liujie7@le.com
 * @date 2017/02
 */
define('conf/index-pc', function(require, exports, module) {
    window.$ = require('jquery');
    // 业务代码
    require('mods/pc/qiandao');
    // 数据统计
    require('mods/pc/analytics');
});
