/**
 * @fileoverview zepto lib 混合文件
 * @authors liyifei@letv.com
 * @date 2015/11
 */

define('lib/chaos/zepto', function(require, exports, module) {

    var zepto = require('lib/zepto/zepto');

    // 模块
    require('lib/zepto/cookie');
    require('lib/zepto/touch');
    require('lib/zepto/detect');
    require('lib/zepto/fx');
    // require('lib/zepto/fx_methods');

    module.exports = zepto;

});
