/**
 * @fileoverview
 * @authors zhangjing20@le.com
 * @date 2017/03
 */

define('mods/4years/second', function(require, exports, module) {
    var $ = require('jquery');
    var $common = require('lib/util/common');

    var ext = __INFO__.ext,
        PageFrom = __INFO__.PageFrom,
        itemRows = $(".last").attr("data-rows");

    // 数据上报
    GCall('creat', 'lefamily_H5', 1, 'cn', ext);
    GCall('setWidgetId', '1.2');
    GCall('track', 'pageview', {
        "PageFrom": PageFrom
    });

    function keyEvent(dir, rows, cols) {
        if (dir == "confirm") { //点击确定按钮
            $('.active').trigger('click');
        }
        if (dir == "top") {
            //点击上键按钮
            topControl(rows, cols);
        }
        if (dir == "bottom") {
            //点击下键按钮
            bottomControl(rows, cols);
        }
        if (dir == "left") {
            leftControl(rows, cols);
        }
        if (dir == "right") {
            rightControl(rows, cols);
        }
    }



    //按上键
    function topControl(rows, cols) {
        rows = Number(rows) - 1;
        if ($("[data-rows=" + rows + "][data-cols=" + cols + "]").length == 0) {
            if (rows < 1) {
                window.history.go(-1);
            }
        } else {
            $("*").removeClass("active");
            $("[data-rows=" + rows + "][data-cols=" + cols + "]").addClass("active");
            $("#block" + rows).slideDown("fast");

        }
    }
    //按下键
    function bottomControl(rows, cols) {
        rows = Number(rows) + 1;
        if ($("[data-rows=" + rows + "][data-cols=" + cols + "]").length == 0) {
            if (rows > itemRows) {
                return;
            }
        } else {
            $("*").removeClass("active");
            $("[data-rows=" + rows + "][data-cols=" + cols + "]").addClass("active");
            $("#block" + (rows - 1)).slideUp("fast");
        }
    }
    //按左键
    function leftControl(rows, cols) {
        cols = Number(cols) - 1;
        if ($("[data-rows=" + rows + "][data-cols=" + cols + "]").length == 0) {
            if (rows == 1 && cols < 1) {
                return;
            }
            rows = Number(rows) - 1;
            $("*").removeClass("active current");
            $("#block" + rows).slideDown("fast");
            $("[data-rows=" + rows + "][data-cols=3]").addClass("active");
        } else {
            $("*").removeClass("active");
            $("[data-rows=" + rows + "][data-cols=" + cols + "]").addClass("active");
        }
    }
    //按右键
    function rightControl(rows, cols) {
        cols = Number(cols) + 1;
        if ($("[data-rows=" + rows + "][data-cols=" + cols + "]").length == 0) {
            if (rows == itemRows) {
                return;
            }
            $("#block" + rows).slideUp("fast");
            rows = Number(rows) + 1;
            cols = 1;
            $("*").removeClass("active current");
            $("[data-rows=" + rows + "][data-cols=1]").addClass("active");
        } else {
            $("*").removeClass("active");
            $("[data-rows=" + rows + "][data-cols=" + cols + "]").addClass("active");
        }
    }

    $(".scrollBox").on('click', '.M_venue.active', function() {
        var params = $(this).attr("data-params");
        var rows = Number($(this).attr("data-rows"));
        var cols = Number($(this).attr("data-cols"));
        var EventPic = $(this).find("img").attr("src");
        var n = (rows - 1) * 3 + cols;
        GCall('setWidgetId', '1.2.1.' + n);
        GCall('track', 'click', {
            "EventPic": EventPic
        });
        try {
            window.jsucenter.jumpOther(params);
        } catch (e) {
            console.log(e);
        }
    });

    $(".scrollBox").on('click', '.last.active', function() {
        window.history.go(-1);
    });



    var clicktag = 0;
    window.onkeydown = function(event) {
        var event = event || window.event;
        event.preventDefault();
        if (clicktag == 0) { //禁止用户频繁点击，0.2秒
            clicktag = 1;
            $common.handler(event.keyCode, keyEvent);
            setTimeout(function() {
                clicktag = 0;
            }, 200);
        }

    };

    //与客户端定义的
    var LeFansH5 = {};
    LeFansH5.onKeyDown = function(keyCode) {
        if (keyCode == 4) { //按返回键
            GCall('setWidgetId', '1.2.2');
            GCall('track', 'click', {
                "RemoteClick": 6
            });
        }
    };
});