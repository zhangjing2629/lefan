// 手机和pc通用的一些工具方法
define('mods/commonTools', function(require, exports, module) {
    function Tools() {}
    // 时间戳转换成yy/mm/dd格式
    Tools.prototype.timestampToDate = function(timestamp) {
        var _this = this;
        // php反回的时间戳是秒，需要变成毫秒格式
        timestamp = timestamp * 1000;
        var dd = new Date(timestamp);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();

        return _this.format0Date(y + '/' + m + '/' + d);
    };
    // 获取n天后的日期
    Tools.prototype.getDateStr = function(addDayCount, fromDay) {
        var _this = this;
        var dd;
        if (fromDay) {
            dd = new Date(fromDay);
        } else {
            dd = new Date();
        }
        dd.setDate(dd.getDate() + addDayCount);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();

        return _this.format0Date(y + '/' + m + '/' + d);
    };
    // 计算时间差
    Tools.prototype.getDateDiff = function(startDate, endDate, noAbs) {
        var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
        var dates = (startTime - endTime) / (1000 * 60 * 60 * 24);
        if (!noAbs) {
            dates = Math.abs(dates);
        }
        return dates;
    };
    // 补齐日期格式
    Tools.prototype.format0Date = function(date) {
        date = date.split('/');
        if (date[1] < 10) {
            date[1] = "0" + parseInt(date[1]);
        }
        if (date[2] < 10) {
            date[2] = "0" + parseInt(date[2]);
        }
        date = date.join('/');

        return date;
    };
    // 补齐日期格式
    Tools.prototype.format0Single = function(date) {
        var formDate;
        if (Number(date) < 10) {
            formDate = "0" + date;
        } else {
            formDate = date;
        }

        return formDate;
    };
    // 获取url中的参数
    Tools.prototype.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        var param = null;
        if (r) {
            param = unescape(r[2]);
        }
        return param;
    };
    // 判断是那种app
    // Tools.prototype.checkApp = function() {
    //     var channel = 0;
    //     if (ENV.isLeMe()) {
    //         // 乐迷 APP
    //         channel = 0;
    //     } else if (ENV.isLetv()) {
    //         // 乐视视频 APP
    //         channel = 1;
    //     }
    //     return channel;
    // };
    module.exports = Tools;
});
