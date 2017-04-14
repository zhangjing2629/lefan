/**
 * @fileoverview 运势页，js入口
 * @authors liujie7@le.com
 * @date 2017/02
 */
define('conf/luck-m', function(require, exports, module) {
    window.$ = require('zepto');
    // 业务代码
    require('mods/mobile/luck');
    // 数据统计
    require('mods/mobile/analytics');
});
