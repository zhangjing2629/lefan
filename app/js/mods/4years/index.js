/**
 * @fileoverview
 * @authors zhangjing20@le.com
 * @date 2017/03
 */

define('mods/4years/index.js', function(require, exports, module) {
    var $ = require('jquery');
    var $common = require('lib/util/common');

    var ext = __INFO__.ext,
        isOver = __INFO__.isOver,
        isStart = __INFO__.isStart,
        Growth = __INFO__.Growth,
        HaveAward = __INFO__.HaveAward,
        cardid = __INFO__.cardid,
        PageFrom = __INFO__.PageFrom;
    var EventStates = 0;
    if (isStart == 0) { //活动未开始
        EventStates = 1;
    } else if (isOver == 1 && HaveAward == 0) {
        EventStates = 2
    } else if (isOver == 1 && HaveAward != 0) {
        EventStates = 3
    }

    // 数据上报
    GCall('creat', 'lefamily_H5', 1, 'cn', ext);
    if (EventStates == 0) {
        GCall('setWidgetId', '1.1');
        GCall('track', 'pageview', {
            "Growth": Growth,
            "HaveAward": HaveAward,
            "PageFrom": PageFrom
        });
    } else {
        GCall('setWidgetId', '1.4');
        GCall('track', 'pageview', {
            "EventStates": EventStates,
            "EventPrize": cardid
        });
    }
    if (EventStates == 1) {
        //活动未开启
        $("#waitLayer").show();
    }
    if (EventStates == 2) {
        //活动已结束并且未中奖
        $("#expiredLayer").show();
    }
    if (EventStates == 3) {
        //活动已结束并且中奖
        $("*").removeClass("active");
        $("#receiveBtn").addClass("active");
        $("#receiveLayer").show();
    }
    /*
      活动未开启,按确定键或上下左右键，跳转到系统添加桌面页面
      活动已开启，按向下键或确定键，跳转到第二页“分会场入口”页。
    */

    function keyEvent(dir, rows, cols) {
        if (dir == "confirm") { //点击确定按钮
            if ($('#closeRule').hasClass('active')) {
                try {
                    window.jsucenter.setPageInt(0);
                } catch (e) {
                    console.log(e);
                };
            }
            $('.active').trigger('click');
        }
        jumpControl(dir)
    }
    var clicktag = 0;

    //与客户端定义的
    window.LeFansH5 = {};
    LeFansH5.onKeyDown = function(keyCode) {
        if (keyCode == 82 && $("#expiredLayer").is(':hidden') && $("#waitLayer").is(':hidden') && $("#receiveLayer").is(':hidden')) { //按菜单键
            try {
                window.jsucenter.setPageInt(1);
            } catch (e) {
                console.log(e);
            };
            GCall('setWidgetId', '1.1.3');
            GCall('track', 'click', {
                "RemoteClick": 7,
                "Growth": Growth
            });
            $("*").removeClass("active");
            $("#closeRule").addClass("active");
            $("#ruleLayer").show();
        } else if (keyCode == 4) { //按返回键
            if ($("#ruleLayer").is(':visible')) {　　 //活动规则弹层显示时，按返回键
                try {
                    window.jsucenter.setPageInt(0);
                } catch (e) {
                    console.log(e);
                };
                GCall('setWidgetId', '1.3.2');
                GCall('track', 'click', {
                    "RemoteClick": 6
                });
                $("*").removeClass("active");
                $("#submitBtn").addClass("active ");
                $("#ruleLayer").hide();
            } else {
                if (EventStates == 0) {
                    GCall('setWidgetId', '1.1.2');
                    GCall('track', 'click', {
                        "RemoteClick": 6,
                        "Growth": Growth
                    });
                } else { //活动状态页按返回键
                    GCall('setWidgetId', '1.4.2');
                    GCall('track', 'click', {
                        "RemoteClick": 6,
                        "EventStates": EventStates,
                        "EventPrize": cardid
                    });
                }

            }

        }
    };


    window.onkeydown = function(event) {
        var event = event || window.event;
        event.preventDefault();

        // 会删掉！！！！！
        LeFansH5.onKeyDown(event.keyCode);

        if (clicktag == 0) { //禁止用户频繁点击，0.2秒
            clicktag = 1;
            $common.handler(event.keyCode, keyEvent);
            setTimeout(function() {
                clicktag = 0;
            }, 200);
        }

    };

    $("#closeRule").on('click', function() {
        GCall('setWidgetId', '1.3.1');
        GCall('track', 'click', {
            "RemoteClick": 5
        });
        try {
            window.jsucenter.jumpOther('{"action" : "com.stv.launcher.action.manage", "type" : 1, "value" : "com.stv.plugin.ucenter", "from" : "com.stv.ucenter"}');
        } catch (e) {
            console.log(e);
        };
    })

    $("#receiveBtn").on('click', function() {
        GCall('setWidgetId', '1.4.1');
        GCall('track', 'click', {
            "RemoteClick": 5,
            "EventPrize": cardid
        });
        alert("领奖")
    })

    function jumpControl(dir) {
        var RemoteClick = 0;
        switch (dir) {
            case "top":
                RemoteClick = 1;
                break;
            case "bottom":
                RemoteClick = 2;
                break;
            case "left":
                RemoteClick = 3;
                break;
            case "right":
                RemoteClick = 4;
                break;
            case "confirm":
                RemoteClick = 5;
                break;
        }

        if (EventStates == 0 && $("#ruleLayer").is(':hidden')) { //活动期间
            GCall('setWidgetId', '1.1.1');
            GCall('track', 'click', {
                "RemoteClick": RemoteClick,
                "Growth": Growth
            });
            if (dir == "confirm" || dir == "bottom") {
                window.location.href = "/fouryears/other";
            }
        } else if (EventStates == 1 || EventStates == 2) { //活动未开启 ||已结束且未中奖
            //打洞到桌面管理
            try {
                window.jsucenter.jumpOther('{"action" : "com.stv.launcher.action.manage", "type" : 1, "value" : "com.stv.plugin.ucenter", "from" : "com.stv.ucenter"}');
            } catch (e) {
                console.log(e);
            };
        }

    }

});