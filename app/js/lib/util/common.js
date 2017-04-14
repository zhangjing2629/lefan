define('lib/util/common', function(require, exports, module) {
    var $ = require('jquery');
    var common = {
        handler: function(keyCode, callback, selector) {
            var nxt = '';
            var dir = 0;
            switch (keyCode) {
                case 4:
                    this.getNextPos("back", callback, selector)
                    break;
                case 13:
                    //toConfirm = true;
                    this.getNextPos("confirm", callback, selector)
                    return;
                    break;
                case 37:
                    // toLeft=true;
                    this.getNextPos("left", callback, selector)
                    break;
                case 38:
                    // toTop=true;
                    this.getNextPos("top", callback, selector)
                    break;
                case 39:
                    // toRight=true;
                    this.getNextPos("right", callback, selector)
                    break;
                case 40:
                    // toBottom=true;
                    this.getNextPos("bottom", callback, selector)
                    break;
                default:
                    return;
                    break;
            }
        },
        getCurPos: function(selector) {
            selector = selector || 'body';
            var rows = $(selector + " .active").attr("data-rows");
            var cols = $(selector + " .active").attr("data-cols");
            var map = [rows, cols];
            return map;
        },

        getNextPos: function(dir, callback, selector) {
            var pos = this.getCurPos(selector);
            var rows = pos[0];
            var cols = pos[1];

            callback && callback(dir, rows, cols, selector)
        }
    }

    module.exports = common;

});