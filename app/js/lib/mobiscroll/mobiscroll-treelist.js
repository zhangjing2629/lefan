define('lib/mobiscroll/mobiscroll-treelist', function(require, exports, module) {
    (function($) {
        var ms = $.mobiscroll,
            presets = ms.presets.scroller;

        presets.treelist = presets.list;

        ms.presetShort('list');
        ms.presetShort('treelist');

    })(Zepto);
});
