/**
 * @fileoverview 获取url中的参数
 * @authors liyifei[liyifei@le.com]
 * @date 2016/02
 */
define('lib/kit/string/getUrlParam', function(require, exports, module) {

    module.exports = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);

        if (r) {
            return unescape(r[2]);
        } else {
            return null;
        }
    };

});