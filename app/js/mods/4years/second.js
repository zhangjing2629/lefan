/**
 * @fileoverview
 * @authors zhangjing20@le.com
 * @date 2017/03
 */

define('mods/4years/second', function(require, exports, module) {
    var $ = require('jquery');
    var $common = require('lib/util/common');

    var ext = __INFO__.ext,
        isOver = __INFO__.isOver,
        isStart = __INFO__.isStart,
        itemRows = $(".last").attr("data-rows");

    // 数据上报
    // GCall('creat', 'lefamily_H5', 1, 'cn', ext);
    // GCall('setWidgetId', 'A0');
    // GCall('track', 'pageview', {
    //     "SavedGrowth": SavedGrowth,
    //     "RemainingTimes": RemainingTimes,
    //     "CurrentCard": CurrentCard,
    //     "PageFrom": PageFrom,
    //     "AwardID": AwardID
    // });



    if (isStart == 0) {
        //活动未开启
        $("#waitLayer").show();
    }
    if (isOver == 1) {
        //活动已结束
        $("#expiredLayer").show();
    }
    /*
      活动未开启,按确定键或上下左右键，跳转到系统添加桌面页面
      活动已开启，按向下键或确定键，跳转到第二页“分会场入口”页。
    */

    function keyEvent(dir, rows, cols) {
        if (dir == "confirm") { //点击确定按钮

            if (isStart == 0) { //活动未开启，打洞跳转
                jumpControl();
            }

            if (isStart == 1 && $("#ruleLayer").is(':hidden')) {
                window.location.href = "";
            }

            if ($('#closeRule').hasClass('active')) {
                try {
                    window.jsucenter.setPageInt(0);
                } catch (e) {
                    console.log(e);
                };
            }
            $('.active').trigger('click');


        }
        if (dir == "top") {
            //点击上键按钮
            if (isStart == 0) {
                jumpControl();
            }
        }
        if (dir == "bottom") {
            //点击下键按钮
            if (isStart == 0) {
                jumpControl();
            } else if (isStart == 1) {
                window.location.href = "";
            }


        }
        if (dir == "left") {
            if (isStart == 0) {
                jumpControl();
            }
        }
        if (dir == "right") {
            if (isStart == 0) {
                jumpControl();
            }

        }
    }
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

});

//按右键
function rightControl(rows, cols) {
    if (rows == itemRows && cols == itemCols) {
        return;
    }
    cols = Number(cols) + 1;
    $("#tips").hide();
    if ($("[data-rows=" + rows + "][data-cols=" + cols + "]").length == 0) {
        if (rows > itemRows || rows == itemCols) {
            return;
        }
        $("#block" + rows).slideUp("fast");
        rows = Number(rows) + 1;
        cols = 1;
        $("*").removeClass("active current");
        $("#block" + rows).slideDown("fast");
        $("#menu" + rows).addClass("current");
        $("[data-rows=" + rows + "][data-cols=1]").addClass("active");
    } else {
        $("*").removeClass("active");
        $("[data-rows=" + rows + "][data-cols=" + cols + "]").addClass("active");
        if (rows != 3 && cols == 3) {
            $("#tips span").text("按遥控下键 “↓” 向下翻页");
            $("#tips").show();
        }
    }
}

$(".M_venue").on('click', '.active', function() {
    var params = $(this).attr("data-params");
    // var rows = $(this).attr("data-rows");
    // var cols = $(this).attr("data-cols");
    // GCall('setWidgetId', 'A1-0' + rows + '-0' + cols);
    // GCall('track', 'click', {
    //     "SavedGrowth": SavedGrowth
    // });
    try {
        window.jsucenter.jumpOther(params);
    } catch (e) {
        console.log(e);
    }
});

//与客户端定义的
var LeFansH5 = {};
LeFansH5.onKeyDown = function(keyCode) {
    if (keyCode == 82 && $("#expiredLayer").is(':hidden') && $("#waitLayer").is(':hidden')) { //按菜单键
        try {
            window.jsucenter.setPageInt(1);
        } catch (e) {
            console.log(e);
        };
        $("*").removeClass("active");
        $("#closeRule").addClass("active");
        $("#ruleLayer").show();
    } else if (keyCode == 4 && $("#ruleLayer").is(':visible')) { //按返回键
        try {
            window.jsucenter.setPageInt(0);
        } catch (e) {
            console.log(e);
        };
        $("*").removeClass("active");
        $("#submitBtn").addClass("active ");
        $("#ruleLayer").hide();
    }
};