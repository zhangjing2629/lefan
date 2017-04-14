// 页面中数据埋点
define('mods/mobile/analytics', function(require, exports, module) {
    var analytics = require('letv/analytics');
    analytics.letvAlyStart('LeMe-M', 2, 'cn', 'ssouid', 0); // 不执行这个没有统计pv的页面点击统计不生效
    // 签到浮层
    $('#pl-dosign').on('tap', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD1');
    });
    // 签到主页面--去完成点击次数
    $('#pl-task').on('tap', '[data-role="toAchieve"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD3');
    });
    // 签到主页面--每一条任务【领乐米】按钮的点击次数
    $('#pl-task').on('tap', '[data-role="task-receive"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD4');
    });
    // 签到主页面--月份按钮的点击数
    $('#pl-head').on('tap', '[data-role="cur-month"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD5');
    });
    // 签到主页面，推广位的点击次数
    $('#pl-recommend').on('tap', '[data-role="list"] li', function() {
        var index = $(this).index() + 1;
        analytics.letvAlysSendAction(0, 41, 'widget_id=QD7&tar_page=' + index);
    });
    // 用户信息页面，点击提交的点击次数
    $('#page-userinfo').on('tap', '[data-role="submit"]', function() {
        var self = $(this);
        if (!self.find('a').hasClass('active')) {
            return;
        }
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD8');
    });
    // 签到成功页面上的去完善点击次数
    $('#pl-sign-succ').on('tap', '[data-role="btn-perfect"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD15&tar_page=2');
    });
    // 签到成功页面上的分享按钮点击次数
    $('#pl-sign-succ').on('tap', '[data-role="btn-share"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD15&tar_page=1');
    });
    // 414wish的点击次数
    $('#pl-account').on('tap', '[data-role="wish-link"]', function() {
        analytics.letvAlysSendAction(0, 5, 'widget_id=QD14');
    });
});
