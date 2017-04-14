define('lib/mobiscroll/mobiscroll-datetime', function(require, exports, module) {
    (function($) {
        $.each(['date', 'time', 'datetime'], function(i, v) {
            $.mobiscroll.presetShort(v);
        });

    })(Zepto);
});
