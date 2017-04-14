// 页面中数据埋点
define('mods/pc/analytics', function(require, exports, module) {
    var analytics = require('letv/analytics');
    analytics.letvAlyStart('LeMe-PC', 0, 'cn', 'ssouid', 0); // 不执行这个没有统计pv的页面点击统计不生效
    // 签到浮层页面
    analytics.letvAlysSendAction(0, 5, 'widget_id=QD9');
    // 签到主页面--每一条任务【领乐米】按钮的点击次数
    $('#pl-task').on('click', '[data-role="task-receive"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD11');
    });
    // 签到主页面，推广位的点击次数
    $('#pl-recommend').on('click', '[data-role="list"] li', function() {
        var index = $(this).index() + 1;
        analytics.letvAlysSendAction(0, 5, 'widget_id=12&tar_page=' + index);
    });
    // 414wish的点击次数
    $('#pl-qr').on('click', '[data-role="wish-link"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD13');
    });
});
