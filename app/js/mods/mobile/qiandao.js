define('mods/mobile/qiandao', function(require, exports, module) {
    // 引入模块
    var $calendar = require('mods/mobile/calendar');
    var $Tools = require('mods/commonTools');
    var $tools = new $Tools;
    var $NewList = require('mods/mobile/newList');
    var $RecommendList = require('mods/mobile/recommendList');
    var $taskList = require('mods/mobile/taskList');
    var $HongbaoRain = require('mods/mobile/hongbaoRain');
    var $Weather = require('mods/weather');
    var $weather = new $Weather;
    var $ENV = require('comp/appEnv');
    var ENV = new $ENV;

    // 请求域名
    var $globalVars = require('mods/global/vars');
    // 用户信息
    var $UserInfo = require('comp/userInfo');
    // 页面模板
    var $pageTpl = require('mods/mobile/pageTpl');

    var nodePage = $('#page-signin');
    if (!nodePage.length) {
        return;
    }

    var analytics = require('letv/analytics');

    var qiandaoObj = {
        // 签到浮层流程
        _initSignLayer: function() {
            var _this = this;

            // 显示签到入口浮层
            this.domNode.layerCover.show();
            this.domNode.dosign.show();
            // 数据上报
            analytics.letvAlysSendAction(0, 5, 'widget_id=QD8&tar_page=1');


            // 点击签到按钮
            this.domNode.dosign.on('tap', function(e) {
                // 请求签到接口
                _this._reqSignApi(function(data) {
                    // 签到成功
                    _this._renderSignRes(data);
                    _this._bindShareAction();
                    _this._hongbaoRain();
                    _this._initHome();
                });
            });
            // 签到成功浮层关闭按钮
            this.domNode.signSucc.on('tap', '[data-role="btn-close"]', function(e) {
                e.stopPropagation();
                setTimeout(function() {
                    _this.domNode.layerCover.hide();
                    _this.domNode.signSucc.hide();
                    _this.domNode.aniRain.hide();
                }, 300);
            });
        },
        // 请求签到接口
        _reqSignApi: function(callback) {
            var _this = this;
            if (this.objVar.lockSign) {
                return;
            }
            this.objVar.lockSign = true;
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/index/channel/' + _this.channel,
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    // 是否已签到
                    var isSign = parseInt(res.data.issign);
                    if (code == 0) {
                        if (isSign == 1) {
                            // 签到成功
                            if (callback) {
                                callback(res.data);
                            }
                        } else {
                            // 已签到
                            alert('已签到');
                        }
                    } else {
                        alert('哇哦！页面迷路找不到了，请稍后再试吧！');
                    }
                },
                complete: function() {
                    _this.objVar.lockSign = false;
                },
                error: function() {
                    alert('哇哦！页面迷路找不到了，请稍后再试吧！');
                }
            });
        },
        // 渲染签到结果
        _renderSignRes: function(data) {
            // 数据
            var credit = data.credit;
            var lasted = data.lasted;
            var extra = parseInt(data.extra);
            var weather = data.weather;
            var astro = data.astro;
            var currentTime = this.curMonth + '月' + this.curDay + '日';
            var city = '北京';
            var astroEmpty = '老夫掐指一算，您还没有完善您的个人信息。';
            // 签到浮层数据渲染
            this.domNode.signSucc.find('[data-role="lemi"]').html(credit);
            this.domNode.signSucc.find('[data-role="sign-cur-lasted"]').html(lasted);
            if (extra != "0") {
                this.domNode.signSucc.find('[data-role="sign-extra"]').show().find('i').html(extra);
            }
            if (weather.city) {
                city = weather.city;
            }
            this.domNode.signSucc.find('[data-role="city"]').html(city);
            this.domNode.signSucc.find('[data-role="weather"]').html(weather.temp + '°C');
            this.domNode.signSucc.find('[data-role="current-time"]').html(currentTime);
            var weatherCode = $weather.weatherImg(weather.code);
            this.domNode.signSucc.find('[data-role="weatherImg"]').addClass('icon_w_' + weatherCode);
            if (astro && astro.fortune) {
                if (ENV.isLeMe()) {
                    this.domNode.signSucc.find('[data-role="text-luck"]').html(astro.fortune).next().attr('data-role', 'btn-share').html('查看更多运势');
                } else {
                    this.domNode.signSucc.find('[data-role="text-luck"]').html(astro.fortune);
                }
            } else {
                this.domNode.signSucc.find('[data-role="text-luck"]').html(astroEmpty).next().attr({
                    'href': '/sign/userinfo.html',
                    'data-role': 'btn-perfect'
                }).html('去完善');
            }

            // 签到成功浮层显示
            this.domNode.dosign.hide();
            this.domNode.layerCover.show();
            this.domNode.signSucc.show();
            this.domNode.aniRain.show();
            // 数据上报
            analytics.letvAlysSendAction(0, 5, 'widget_id=QD8&tar_page=2');

        },
        // 签到浮层动画-红包雨
        _hongbaoRain: function() {
            // 红包雨
            var $hongbaoRain = new $HongbaoRain();
            $hongbaoRain.init();
        },
        // 点击分享
        _bindShareAction: function() {
            var _this = this;
            this.domNode.signSucc.on('tap', '[data-role="btn-share"]', function() {
                _this._showShare();
            });
        },
        // 分享运势操作
        _showShare: function() {
            var _this = this;
            // 分享信息
            var avatar = _this.avatar;
            var nickname = _this.nickname;
            nickname = encodeURI(encodeURI(nickname));
            var uid = _this.uid;
            var shareData = {
                'url': this.curHost + '/sign/luck.html?uid=' + uid + '&avatar=' + avatar + '&nickname=' + nickname,
                'title': '每日一签 签签有礼',
                'description': '我今天的运势原来是这样的！快来一起算算吧~'
            };
            // 分享的数据
            var url = shareData.url;
            var title = shareData.title;
            var description = shareData.description;
            if (ENV.isLeMe()) {
                if (typeof LeMe == "undefined") {
                    window.LeMe = {};
                }
                if (typeof LeMe.appProxy == "undefined") {
                    LeMe.appProxy = {};
                }
                // LeMe.appProxy.shareCallBack = function(data) {

                // };
                // 乐迷 APP
                if (ENV.isLeMeAndroid()) {
                    try { //新版本带回调
                        LeMeJSBridge.showShare(url, title, description, '');
                    } catch (e) {
                        try { //旧版本不支持回调
                            LeMeJSBridge.showShare(url, title, description);
                        } catch (e) {
                            return;
                        }
                    }
                } else if (ENV.isLeMeIos()) {
                    try {
                        window.webkit.messageHandlers.showShare.postMessage({
                            'url': url,
                            'title': title,
                            'description': description,
                            'callback': ''
                        });
                    } catch (e) {
                        return;
                    }
                }
            }
        },
        // 引导浮层
        _initGuideLayer: function() {
            var _this = this;
            // 定义浮层出现的cookie
            if (!$.cookie('guideCookie' + $UserInfo.uid)) {
                _this.domNode.layerGuide.show();
                $.cookie('guideCookie' + $UserInfo.uid, 1, {
                    expires: 365
                });
            }
            this.domNode.layerGuide.on('touchstart', function() {
                var self = $(this);
                setTimeout(function() {
                    self.hide();
                }, 200);
            });
        },
        // 主页面流程
        _initHome: function() {
            var _this = this;

            // 引导页面
            this._initGuideLayer();
            // 显示主页面外层节点
            this.domNode.main.show();
            // 初始化签到日历
            $calendar.init();
            // 渲染用户信息部分
            this._reqUserInfoApi(function(data) {
                _this._renderUserInfo(data);
            });

            // 签到提醒
            // this._reqPushStatus(function(data) {
            //     _this._renderPushStatus(data);
            // });
            this._bindPushToggle();
            // 初始化头部本月签到日历
            this._initHeadCal();
            // 请求签到信息
            this._reqSignInfoApi(function(data) {
                _this._renderSignInfo(data);
                // 请求连续签到额外奖励信息
                _this._reqExtra(function(data) {
                    _this._renderExtra(data);
                });
            });
            // 请求签到记录信息
            this._reqSignRecordApi(function(data) {
                _this._renderSignRecord(data);
            });

            // 大家看推荐模块
            $RecommendList.init();
            // 任务模版
            $taskList.init();
            // 排行榜模块
            $NewList.init();
            // this._honerListRender();
            // 数据上报
            analytics.letvAlysSendAction(0, 5, 'widget_id=QD8&tar_page=3');

        },
        // 事件绑定-签到提醒切换
        _bindPushToggle: function() {
            // 点击请求签到接口，将用户状态发送至后台
            this.domNode.head.find('[data-role="btn-push"]').on('tap', function() {
                var self = $(this);
                // var hasChecked = self.hasClass('checked');
                // if(hasChecked){

                // }else{

                // }
                self.toggleClass('checked');
            });
        },
        // 事件绑定-点击月份出现日历插件
        _bindCalenderToggle: function() {
            var _this = this;
            this.domNode.head.find('[data-role="cur-month"]').on('tap', function() {
                _this.domNode.layerCover.show();
                _this.domNode.signCal.show();
                // 数据上报
                analytics.letvAlysSendAction(0, 5, 'widget_id=QD8&tar_page=4');

                // 浮层出现
                if (ENV.isLeMe()) {
                    try {
                        LeMeJSBridge.setPageId(1);
                        _this._layerEvent();
                    } catch (e) {
                        return;
                    }
                }
            });
            // 点击关闭按钮
            _this.domNode.signCal.on('tap', '[data-role="btn-close"]', function(e) {
                e.stopPropagation();
                _this.domNode.layerCover.hide();
                _this.domNode.signCal.hide();
                if (ENV.isLeMe()) {
                    try {
                        LeMeJSBridge.setPageId(0);
                    } catch (e) {
                        return;
                    }
                }
            });
        },
        // 渲染用户信息部分
        _renderUserInfo: function(res) {
            var _this = this;
            _this.uid = res.uid;
            var avatar = res.picture.split(',')[1].replace('https://', 'http://');
            _this.avatar = avatar;
            // var avatar = $UserInfo.uheadpic.headicon_200.replace('https://', 'http://');
            var nickname = res.username;
            _this.nickname = nickname;
            var render = '<img src="' + avatar + '"><span>' + nickname + '</span>';
            $(render).appendTo(this.domNode.head.find('[data-role="userinfo"]'));
        },
        // 用户信息请求
        _reqUserInfoApi: function(callback) {
            $.ajax({
                url: $globalVars.apiDomain + '/Task/Index/getProfile',
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    if (code == 0) {
                        if (callback) {
                            callback(res.data);
                        }
                    } else {
                        return;
                    }
                },
                error: function() {
                    return;
                }
            });
        },
        // 请求签到提醒开关接口
        _reqPushStatus: function(callback) {
            // $.ajax({
            //     url: '',
            //     type: 'GET',
            //     dataType: 'json',
            //     success: function(res) {
            //         var code = res.ret;
            //         if (code == 0 && callback) {
            //             callback(res.data);
            //         }
            //     }
            // });
        },
        // 渲染签到提醒状态
        _renderPushStatus: function(data) {
            var elBtnPush = this.domNode.head.find('[data-role="btn-push"]');
            if (data.status != 1) {
                elBtnPush.removeClass('checked');
            }
        },
        // 初始化头部本月签到日历
        _initHeadCal: function() {
            // 创建本月日期
            var _this = this;
            var days = $calendar._getDaysInOneMonth(_this.curYear, _this.curMonth);
            var dayString = [];
            // 节点
            // var elCurCalendar = this.domNode.head.find('[data-role="cur-calendar"]');
            var elCurDaysBar = this.domNode.head.find('[data-role="cur-days-bar"]');
            var elCurDays = this.domNode.head.find('[data-role="cur-days"]');
            var elBtnArrow = this.domNode.head.find('[data-role="btn-arrow"]');
            // 当前月份
            _this.domNode.head.find('[data-role="cur-month"]').html(_this.curMonth + '月');
            // 本月天数
            var i, dateid;
            for (i = 1; i <= days; i++) {
                dateid = _this.curYear + '/' + $calendar._fixDate(_this.curMonth) + '/' + $calendar._fixDate(i);
                dayString.push('<i data-dateid="' + dateid + '">' + i + '</i>');
            }
            var currentString = dayString.join('');
            $(currentString).appendTo(elCurDays);
            // 不展示出来的话不占位，无法取到宽度
            // elCurCalendar.removeClass('hide');
            // 计算容器宽度
            var widthLi = parseFloat(elCurDays.find('i').width());
            var widthMarginRight = parseFloat(elCurDays.find('i').css('margin-right'));
            var width = (widthLi + widthMarginRight) * days;
            elCurDays.width(width);
            // 当前日期放在最左边
            var scrollLeft = (widthLi + widthMarginRight) * (_this.curDay - 1);
            elCurDaysBar.scrollLeft(scrollLeft);
            // elCurCalendar.addClass('hide');
            // 点击当月日历切换
            elBtnArrow.on('tap', function(e) {
                _this._toggleCurCalendar();
            });
            // 签到日历切换
            this._bindCalenderToggle();
            // 当月日历闪现效果
            _this._headCalBlink();
        },
        // 切换首页当月日历显示隐藏
        _toggleCurCalendar: function() {
            var elBtnArrow = this.domNode.head.find('[data-role="btn-arrow"]');
            var elCurCalendar = this.domNode.head.find('[data-role="cur-calendar"]');
            if (elBtnArrow.hasClass('arrow_up')) {
                // 隐藏
                elBtnArrow.removeClass('arrow_up');
                elCurCalendar.css({
                    'height': '0rem',
                    'padding-bottom': '0rem'
                });
            } else {
                // 显示
                elBtnArrow.addClass('arrow_up');
                elCurCalendar.css({
                    'height': '3.5rem',
                    'padding-bottom': '1.6rem'
                });
            }
        },
        // 签到成功页面消失的时候本月日历闪现效果
        _headCalBlink: function() {
            var _this = this;
            var elBtnArrow = this.domNode.head.find('[data-role="btn-arrow"]');
            var elCurCalendar = this.domNode.head.find('[data-role="cur-calendar"]');
            var intTime = setInterval(function() {
                // 当每天第一次登录的时候，且签到浮层关闭的时候，进行展示
                if (_this.isFirst && _this.domNode.signSucc.css('display') === 'none') {
                    setTimeout(function() {
                        elBtnArrow.addClass('arrow_up');
                        elCurCalendar.animate({
                            'height': '3.5rem',
                            'padding-bottom': '1.6rem'
                        }, 800, function() {
                            setTimeout(function() {
                                elBtnArrow.removeClass('arrow_up');
                                elCurCalendar.animate({
                                    'height': 0,
                                    'padding-bottom': '0rem'
                                }, 800);
                            }, 1000);
                        });
                    }, 500);
                    clearInterval(intTime);
                }
            }, 200);
        },
        // 请求签到信息接口
        _reqSignInfoApi: function(callback) {
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/info',
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    var data = res.data;
                    if (code == 0 && callback) {
                        callback(data);
                    }
                },
                error: function() {
                    return;
                }
            });
        },
        // 渲染签到信息内容
        _renderSignInfo: function(data) {
            // 连续签到天数
            var lasted = parseInt(data.lasted);
            // 乐米数
            var lemi = data.lemi;
            // 历史累计签到天数
            var total = data.total;
            // 今日签到排名
            var rank = data.rank;

            this.lasted = lasted;
            this.domNode.signCal.find('[data-role="text-total"]').html(total);
            this.domNode.signCal.find('[data-role="text-lasted"]').html(lasted);
            this.domNode.signCal.find('[data-role="text-rank"]').html(rank);
            this.domNode.account.find('[data-role="text-points"]').html(lemi);
            var render = [
                '<i class="ten num_0"></i>',
                '<i class="single num_' + lasted + '"></i>',
                '<span>天</span>'
            ].join('');
            if (lasted >= 10) {
                render = [
                    '<i class="ten num_' + parseInt(lasted / 10) + '"></i>',
                    '<i class="single num_' + (lasted % 10) + '"></i>',
                    '<span>天</span>'
                ].join('');
            }
            $(render).appendTo(this.domNode.head.find('[data-role="sign-days"]'));
            var days = $calendar._getDaysInOneMonth(this.curYear, this.curMonth);
            var width = lasted / days;
            this.domNode.head.find('[data-role="cur-bar"] span').css('width', width * 100 + '%');
        },
        // 请求签到记录接口
        _reqSignRecordApi: function(callback) {
            var _this = this;
            $calendar.onRenderSignRecord = function() {
                // 判断是否有缓存
                var dateKey = $calendar.curYear + '|' + $calendar.curMonth;
                if (_this.objVar.cacheSignRecord[dateKey] && callback) {
                    callback(_this.objVar.cacheSignRecord[dateKey]);
                } else {
                    $.ajax({
                        url: $globalVars.apiDomain + '/Sign/Index/record/year/' + $calendar.curYear.toString().substr(2) + '/month/' + $calendar.curMonth,
                        type: 'GET',
                        dataType: 'jsonp',
                        success: function(res) {
                            var signRecordData = res.data;
                            // 记录缓存
                            _this.objVar.cacheSignRecord[dateKey] = signRecordData;
                            if (callback) {
                                callback(signRecordData);
                            }
                        },
                        error: function() {
                            return;
                        }
                    });
                }
            };
            $calendar.onRenderSignRecord.call($calendar);
        },
        // 渲染签到纪录
        _renderSignRecord: function(data) {
            // 签到记录数据
            var signRecordArr = data;
            // 顶部当月日历节点
            var elCurDays = this.domNode.head.find('[data-role="cur-days"]');
            // 签到日期
            var targetDate = '';
            // 当天日期
            var curDate = $tools.format0Date(this.curYear + '/' + this.curMonth + '/' + this.curDay);
            var i;

            if (!$.isArray(signRecordArr) || !signRecordArr.length) {
                return;
            }

            $calendar.dataList = signRecordArr;
            // 遍历签到记录数据，渲染日历日期样式
            for (i = 0; i < signRecordArr.length; i++) {
                targetDate = $tools.timestampToDate(signRecordArr[i].dateline);

                if (targetDate != curDate && signRecordArr[i].extracredit == '0') {
                    // 不是当天，没有额外奖励
                    elCurDays.find('i[data-dateid="' + targetDate + '"]').addClass('signed');
                    $calendar._changeClass(targetDate, 'signed');
                } else if (targetDate != curDate && signRecordArr[i].extracredit != '0') {
                    // 不是当天，有额外奖励
                    elCurDays.find('i[data-dateid="' + targetDate + '"]').addClass('signed');
                    $calendar._changeClass(targetDate, 'gifting', $pageTpl.extraGift);
                } else if (targetDate == curDate && signRecordArr[i].extracredit == '0') {
                    // 当天，没有额外奖励
                    elCurDays.find('i[data-dateid="' + targetDate + '"]').addClass('now');
                    $calendar._changeClass(targetDate, 'now');
                } else {
                    // 当天，有额外奖励
                    elCurDays.find('i[data-dateid="' + targetDate + '"]').addClass('now');
                    $calendar._changeClass(targetDate, 'gifting', $pageTpl.extraGift);
                }
            }
            this._bindToggleExtra();
        },
        // 请求连续签到额外奖励
        _reqExtra: function(callback) {
            var _this = this;
            $calendar.onRenderExtra = function() {
                // 判断是否有缓存
                if (_this.objVar.cacheExtra.length && callback) {
                    callback(_this.objVar.cacheExtra);
                } else {
                    // 请求接口获取连续签到额外奖励数据
                    $.ajax({
                        url: $globalVars.apiDomain + '/Sign/Index/extra',
                        type: 'GET',
                        dataType: 'jsonp',
                        success: function(res) {
                            var code = res.ret;
                            var extraDayArr = res.data;
                            if (code == 0 && callback) {
                                // 记录缓存
                                _this.objVar.cacheExtra = extraDayArr;
                                callback(extraDayArr);
                            }
                        },
                        error: function() {
                            return;
                        }
                    });
                }
            };
            $calendar.onRenderExtra.call($calendar);
        },
        // 渲染连续签到额外奖励
        _renderExtra: function(data) {
            var extraDayArr = data;
            // 本月总天数
            var totalDays = new Date(this.curYear, this.curMonth, 0).getDate();
            // 本月连续签到天数
            var keepDays = this.lasted;
            // 宝盒日期
            var giftDate;
            // 未来 n 天后出现宝盒的日期
            var afterDays;
            // 渲染宝盒节点
            var i;
            for (i = 0; i < extraDayArr.length; i++) {
                // 未来天数>0 && 在本月范围内
                afterDays = parseInt(extraDayArr[i].days) - keepDays;
                if (afterDays > 0 && this.curDay + afterDays <= totalDays) {
                    giftDate = $tools.getDateStr(afterDays);
                    $calendar._changeClass(giftDate, 'gift', $pageTpl.extraGift);
                }
            }
            this._bindToggleExtra();
        },
        // 绑定事件-切换显示连续签到礼盒
        _bindToggleExtra: function() {
            var elExtra = this.domNode.signCal.find('[data-role="extra"]');
            this.domNode.signCal.on('tap', '[data-role="gift"]', function(e) {
                e.stopPropagation();
                var self = $(this);
                elExtra.hide();
                self.find('[data-role="extra"]').show();
            });
            $(document).not('[data-role="extra"]').on('tap', function(e) {
                e.stopPropagation();
                elExtra.hide();
            });
        },
        // 设置浮层是否出现
        _layerEvent: function() {
            var _this = this;
            if (typeof LeMe == "undefined") {
                window.LeMe = {};
            }
            if (typeof LeMe.appProxy == "undefined") {
                LeMe.appProxy = {};
            }
            LeMe.appProxy.layerHide = function(keyCode) {
                // 0是指主页面,1是有浮层
                if (keyCode == 4) {
                    _this.domNode.layerCover.hide();
                    _this.domNode.signCal.hide();
                    try {
                        LeMeJSBridge.setPageId(0);
                    } catch (e) {
                        return;
                    }
                }
            };
            // var iosData = {
            //     "pageId": "0"
            // };
            // iosData = JSON.stringify(iosData);
            // window.webkit.messageHandlers.setPageId.postMessage(iosData);
        },
        // 排行榜模块
        _honerListRender: function() {
            var $newList = new $NewList;
            var res = [{
                username: 'user1',
                prize: '手机1S'
            }, {
                username: 'user2',
                prize: '手机2'
            }, {
                username: 'user4',
                prize: '超级电视X60'
            }, {
                username: 'user4',
                prize: '超级电视X60'
            }];
            $newList.init(res);
            setTimeout(function() {
                $newList.step();

            }, 2000);
        },

        // 未登录时要进行登录，不同app采用不同方法
        _doLogin: function() {
            this.isLogin = $UserInfo.uid == 0 ? false : true;
            if (!this.isLogin) {
                // app环境
                if (ENV.isLeMe()) {
                    // 乐迷 APP
                    if (ENV.isLeMeAndroid()) {
                        try {
                            LetvJSBridge_For_Android.fun_callLogin('[{}]');
                        } catch (e) {
                            LeMeJSBridge.showLogin();
                        }
                    } else if (ENV.isLeMeIos()) {
                        window.webkit.messageHandlers.showLogin.postMessage('{}');
                    }
                } else if (ENV.isLetv()) {
                    // 乐视视频 APP
                    LetvJSBridge.fun.callLogin(function(data) {
                        if (data.result === 200) {
                            //成功调起客户端登录页面
                        }
                    });
                } else {
                    // 非app环境
                    if (typeof LEPass !== 'undefined') {
                        LEPass.openLoginPage();
                    }
                }
            }
        },
        // 判断现在是哪种app
        _checkApp: function() {
            var _this = this;
            if (ENV.isLeMe()) {
                // 乐迷 APP
                _this.channel = 0;
            } else if (ENV.isLetv()) {
                // 乐视视频 APP
                _this.channel = 1;
            }
        },
        // 请求签到状态接口
        _reqSignStatusApi: function(callback) {
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/getstatus',
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    // 是否已经签到
                    // 0-已签到 1-没签到
                    var status = 1;
                    if (code == 0) {
                        status = 0;
                    }
                    if (callback) {
                        callback(status);
                    }
                },
                error: function() {
                    return;
                }
            });
        },
        // 判断签到状态
        _checkSignStatus: function(status) {
            var _this = this;
            var isSign = status;
            if (isSign) {
                // 当天未签到
                // 签到浮层流程
                _this._initSignLayer();
            } else {
                // 当天已签到
                // 主页面流程
                _this.isFirst = false;
                _this._initHome();
            }
        },
        // 渲染背景图
        _renderBgImg: function() {
            var _this = this;
            var elLayerCover = _this.domNode.layerCover;
            var elHead = _this.domNode.head;
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/bgimg/channel/' + _this.channel,
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    var imgCover = res.data.img1;
                    var imgHead = res.data.img2;
                    if (elLayerCover.length) {
                        // 浮层背景
                        if (code == 0 && imgCover) {
                            elLayerCover.css('backgroundImage', 'url(' + imgCover + ')');
                        } else {
                            elLayerCover.css('backgroundImage', 'url(' + _this.objVar.imgCover + ')');
                        }
                    }
                    if (elHead.length) {
                        // 首页头部背景
                        if (code == 0 && imgHead) {
                            elHead.css('backgroundImage', 'url(' + imgHead + ')');
                        } else {
                            elHead.css('backgroundImage', 'url(' + _this.objVar.imgHead + ')');
                        }
                    }
                },
                error: function() {
                    if (elLayerCover.length) {
                        // 浮层背景
                        elLayerCover.css('backgroundImage', 'url(' + _this.objVar.imgCover + ')');
                    }
                    if (elHead.length) {
                        // 首页头部背景
                        elHead.css('backgroundImage', 'url(' + _this.objVar.imgHead + ')');
                    }
                }
            });
        },
        // 初始化变量
        _initVars: function() {
            // 变量对象
            this.objVar = {};
            // host
            this.curHost = window.location.protocol + '//' + window.location.hostname;
            // 日期
            this.curDate = new Date();
            this.curYear = this.curDate.getFullYear();
            this.curMonth = this.curDate.getMonth() + 1;
            this.curDay = this.curDate.getDate();
            // 是否登录
            this.isLogin = false;
            // 已签到状态，是否第一次进入页面
            this.isFirst = true;
            // 是哪种app
            this.channel = 0;
            // 用户uid
            this.uid = 0;
            // 用户昵称
            this.nickname = '';
            // 用户头像
            this.avatar = '';
            // 本月连续签到天数
            this.lasted = 0;
            // 请求签到接口锁
            this.objVar.lockSign = false;
            // 默认背景图
            this.objVar.imgCover = 'http://i2.letvimg.com/lc06_iscms/201702/21/14/13/5b4d55f479ce4cbe842bc10041fd4f7e.png';
            this.objVar.imgHead = 'http://i2.letvimg.com/lc05_iscms/201702/21/14/13/5a0e65f79b684aa28df60e38e4a54057.png';
            // 签到记录缓存
            this.objVar.cacheSignRecord = {};
            // 连续签到额外奖励缓存
            this.objVar.cacheExtra = [];
        },
        // 初始化dom节点
        _initDom: function() {
            // 渲染各模块模板
            nodePage.html($pageTpl.mod);
            // host
            this.curHost = window.location.protocol + '//' + window.location.hostname;
            // 各模块节点
            this.domNode = {};
            // 底部图片
            this.domNode.layerCover = $('#pl-layer-cover');
            // 引导浮层
            this.domNode.layerGuide = $('#pl-layer-guide');
            // 动画-红包雨
            this.domNode.aniRain = $('#pl-ani-rain');

            // 签到浮层
            this.domNode.dosign = $('#pl-dosign');
            this.domNode.signSucc = $('#pl-sign-succ');

            // 签到日历浮层
            this.domNode.signCal = $('#pl-sign-cal');

            // 主页面
            this.domNode.main = $('#pl-main');
            // 页面头部
            this.domNode.head = $('#pl-head');
            // 我的乐米、链接模块
            this.domNode.account = $('#pl-account');
            // 大家看推荐模块
            this.domNode.recommend = $('#pl-recommend');
        },
        // APP交互记录页面位置
        _initPageId: function() {
            if (ENV.isLeMe()) {
                if (typeof LeMeJSBridge !== "undefined" && typeof LeMeJSBridge.setPageId !== 'undefined') {
                    LeMeJSBridge.setPageId(0);
                }
            }
        },
        // 逻辑入口
        init: function() {
            var _this = this;

            // 判断登录状态
            this._doLogin();

            // 初始化
            this._initVars();
            this._initDom();

            this._initPageId();
            // 判断 app 渠道
            this._checkApp();
            // 渲染背景图
            this._renderBgImg();

            // 请求签到状态接口
            this._reqSignStatusApi(function(data) {
                _this._checkSignStatus(data);
            });
        }
    };

    qiandaoObj.init();
});
