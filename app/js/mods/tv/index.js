/**
 * @fileoverview
 * @authors zhangjing20@le.com
 * @date 2017/03
 */

define('mods/tv/index', function(require, exports, module) {
    var $ = require('jquery');
    var $common = require('lib/util/common');
    var $card1 = $("#card1"),
        $card2 = $("#card2"),
        $card3 = $("#card3"),
        $lastNum = $(".lastNum"),
        $submitBtn = $("#submitBtn"),
        $ruleLayer = $("#ruleLayer"),
        $closeRule = $("#closeRule"),
        $tips = $("#tips"),
        $expiredLayer = $("#expiredLayer"),
        $waitLayer = $("#waitLayer"),
        activeId = __INFO__.activeId,
        ext = __INFO__.ext,
        SavedGrowth = __INFO__.SavedGrowth,
        RemainingTimes　 = __INFO__.RemainingTimes,
        CurrentCard = __INFO__.CurrentCard,
        AwardID = __INFO__.AwardID,
        activeEnd = __INFO__.ActiveEnd, //0为结束
        PageFrom = __INFO__.PageFrom,
        isStart = __INFO__.IsStart; //0为未开始

    // 数据上报
    GCall('creat', 'lefamily_H5', 1, 'cn', ext);
    GCall('setWidgetId', 'A0');
    GCall('track', 'pageview', {
        "SavedGrowth": SavedGrowth,
        "RemainingTimes": RemainingTimes,
        "CurrentCard": CurrentCard,
        "PageFrom": PageFrom,
        "AwardID": AwardID
    });

    if ($("#submitBtn .lastNum").text() > 0 || $submitBtn.text() == '查看奖励') {
        $submitBtn.removeClass('M_btn_b');
    }

    $submitBtn.on('click', function() {
        var $dataAttr = $(this).attr("data-attr");
        var params = $(this).attr("data-params");
        var $this = $(this);

        if ($dataAttr == "toUse") { //去抽奖

            toUseCb($this);

        } else if ($dataAttr == "toGetOne") { //获取一次翻牌机会

            GCall('setWidgetId', 'A0-01');
            GCall('track', 'click', {
                "ButtonStatus": 2,
                "SavedGrowth": SavedGrowth,
                "RemainingTimes": RemainingTimes,
                "CurrentCard": CurrentCard,
                "PageFrom": PageFrom,
                "AwardID": AwardID
            });
            window.location.href = params;

        } else if ($dataAttr == "toGetTwo") { //2连翻

            GCall('setWidgetId', 'A0-01');
            GCall('track', 'click', {
                "ButtonStatus": 3,
                "SavedGrowth": SavedGrowth,
                "RemainingTimes": RemainingTimes,
                "CurrentCard": CurrentCard,
                "PageFrom": PageFrom,
                "AwardID": AwardID
            });
            window.location.href = params;

        } else if ($dataAttr == "toGetTen") { //10连翻

            GCall('setWidgetId', 'A0-01');
            GCall('track', 'click', {
                "ButtonStatus": 4,
                "SavedGrowth": SavedGrowth,
                "RemainingTimes": RemainingTimes,
                "CurrentCard": CurrentCard,
                "PageFrom": PageFrom,
                "AwardID": AwardID
            });
            window.location.href = params;

        } else if ($dataAttr == "toLookPrize") { //查看奖励，打洞跳转到我的卡券

            GCall('setWidgetId', 'A0-01');
            GCall('track', 'click', {
                "ButtonStatus": 5,
                "SavedGrowth": SavedGrowth,
                "RemainingTimes": RemainingTimes,
                "CurrentCard": CurrentCard,
                "PageFrom": PageFrom,
                "AwardID": AwardID
            });

            try {
                window.jsucenter.jumpOther(params);
            } catch (e) {
                console.log(e);
            };
        }
    });

    function toUseCb(obj) {
        if (obj.hasClass("disabled")) {
            return;
        }

        obj.addClass("disabled");
        $.ajax({
            url: '/apiTurnover/turnover',
            type: 'post',
            data: {
                activeId: activeId
            },
            cache: false,
            dataType: 'json',
            success: function(res) {
                var data, card, isAward, awardId, growth, remainingTimes, msg, step;
                if (res.code == 10000) {
                    data = res.data;
                    card = data.card; //翻中的数字
                    isAward = data.isAward; //是否为大奖，1是
                    AwardID = awardId = data.awardId; //中奖等级：1=》1等，2=》2等，0=》特等，9=》没中
                    SavedGrowth = growth = data.growth; //成长值；
                    RemainingTimes = remainingTimes = Number(data.remainingTimes); //剩余次数
                    // allTimes = Number(data.allTimes); //总次数
                    msg = data.msg; //提示消息
                    CurrentCard = step = data.step; //对应当前的牌位
                    CurrentCard > 3 ? 3 : CurrentCard;

                    //数据上报
                    GCall('setWidgetId', 'A0-01');
                    GCall('track', 'click', {
                        "ButtonStatus": 1,
                        "SavedGrowth": growth,
                        "RemainingTimes": remainingTimes,
                        "CurrentCard": CurrentCard,
                        "PageFrom": PageFrom,
                        "AwardID": awardId
                    });

                    if (step == 1) { //翻第一张牌

                        $card1.removeClass("card_normal").addClass("card_4  flipInY animated");
                        $card2.removeClass("card_no").addClass("card_normal");
                        obj.removeClass("disabled");

                    } else if (step == 2) { //翻第二张牌

                        $card2.removeClass("card_normal").addClass("card_1  flipInY animated");
                        $card3.removeClass("card_no").addClass("card_normal");
                        obj.removeClass("disabled");

                    } else { //翻第三张牌
                        // 翻最后一张牌，没有中奖
                        if (isAward == 0) {
                            $card3.removeClass().addClass("card card_" + card + " flipInY animated");
                            setTimeout(function() {
                                $card3.removeClass().addClass("card flipOutY animated card_normal");
                                obj.removeClass("disabled");
                            }, 1500);
                        } else if (isAward == 1) {
                            $card3.removeClass().addClass("card card_" + card + " flipInY animated");
                            setTimeout(function() {
                                if (awardId == 0) {
                                    $card3.find("span").addClass("prize grandPrize zoomOut"); //特等奖
                                } else if (awardId == 1) {
                                    $card3.find("span").addClass("prize onePrize zoomOut"); //一等奖
                                } else if (awardId == 2) {
                                    $card3.find("span").addClass("prize twoPrize zoomOut"); //二等奖
                                }
                                obj.removeClass("disabled");
                            }, 1000);
                            $submitBtn.text("查看奖励");
                            $submitBtn.attr("data-attr", "toLookPrize");
                            $submitBtn.attr("data-params", '{"action":"com.stv.ucenter.action","value":{"type":3,"privilege":0},"type":3,"from":"com.stv.ucenter"}');
                        }
                    }

                    $tips.find('span').text(msg).end().show();
                    setTimeout(function() {
                        $tips.hide();
                    }, 3000);


                    // 按钮状态判断
                    if (isAward == 0 && remainingTimes <= 0) {
                        if (growth >= 200 && growth <= 1000) {
                            $submitBtn.text("如何获得2连翻");
                            $submitBtn.attr("data-attr", "toGetTwo");
                            $submitBtn.attr("data-params", "/turnover/more/activeId/" + activeId + "/#2");
                        } else if (growth > 1000) {
                            $submitBtn.text("如何获得10连翻");
                            $submitBtn.attr("data-attr", "toGetTen");
                            $submitBtn.attr("data-params", "/turnover/more/activeId/" + activeId + "/#3");
                        }
                        $submitBtn.addClass('M_btn_b');
                    }
                    $lastNum.text(remainingTimes);

                } else {
                    obj.removeClass("disabled");
                }

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                obj.removeClass("disabled");
                $tips.find('span').text("网络断开或无效，请检查网络后重试").end().show();
                setTimeout(function() {
                    $tips.hide();
                }, 3000);
            }
        });
    }
    //活动已过期
    if (activeEnd == 1) {
        $expiredLayer.show();
        $("*").removeClass("active");
    }
    //活动未开始
    if (isStart == 0) {
        $waitLayer.show();
        $("*").removeClass("active");
    }
    //活动规则
    $closeRule.on('click', function() {
        $ruleLayer.hide();
        $("*").removeClass("active");
        $submitBtn.addClass("active");
    });


    function keyEvent(dir, rows, cols) {
        if (dir == "confirm") {
            //点击确定按钮
            if ($('#closeRule').hasClass('active')) {
                try {
                    window.jsucenter.setPageInt(0);
                } catch (e) {
                    console.log(e);
                };
            }
            $('.active').trigger('click');
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