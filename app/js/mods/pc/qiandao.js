define('mods/pc/qiandao', function(require, exports, module) {
    var $calendar = require('mods/pc/calendar');
    var $Tools = require('mods/commonTools');
    var $tools = new $Tools;
    var $taskList = require('mods/pc/taskList');
    var $RecommendList = require('mods/pc/recommendList');
    var $UserInfo = require('comp/userInfo');
    // 天气
    var $Weather = require('mods/weather');
    var $weather = new $Weather;
    // 请求域名
    var $globalVars = require('mods/global/vars');
    // 页面模版
    var $pageTpl = require('mods/pc/pageTpl');


    var nodePage = $('#page-signin');
    if (!nodePage.length) {
        return;
    }


    var qiandaoObj = {
        // 点击显示app二维码
        _appQrShow: function() {
            var qrBtn = this.domNode.qrNode.find('[data-role="qr_btn"]');
            var qrImg = this.domNode.qrNode.find('[data-role="qr_img"]');
            qrBtn.on('click', function(e) {
                e.stopPropagation();
                qrImg.toggle();
            });
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
            this.domNode.signInfo.find('[data-role="text-total"]').html(total);
            this.domNode.signInfo.find('[data-role="text-rank"]').html(rank);
            this.domNode.signInfo.find('[data-role="text-points"]').html(lemi);
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
                    var credit = res.data.credit;
                    if (code == 0) {
                        if (isSign == 1) {
                            _this.domNode.signCal.find('[data-role="lemi"]').html('+' + credit);
                            _this.domNode.signCal.find('[data-role="sign-success"]').slideDown(1000);
                            setTimeout(function() {
                                _this.domNode.signCal.find('[data-role="sign-success"]').fadeOut(2000);
                            }, 2000);
                        }
                        // 签到成功
                        if (callback) {
                            callback(res.data);
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
            var weather = data.weather;
            var currentTime = this.curMonth + '月' + this.curDay + '日';
            var city = '北京';
            if (weather.city) {
                city = weather.city;
            }
            this.domNode.signInfo.find('[data-role="city"]').html(city);
            this.domNode.signInfo.find('[data-role="weather"]').html(weather.temp + '°C');
            this.domNode.signInfo.find('[data-role="current-time"]').html(currentTime);
            var weatherCode = $weather.weatherImg(weather.code);
            this.domNode.signInfo.find('[data-role="weatherImg"]').addClass('icon_w_' + weatherCode);
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
                    $calendar._changeClass(targetDate, 'signed');
                } else if (targetDate != curDate && signRecordArr[i].extracredit != '0') {
                    // 不是当天，有额外奖励
                    $calendar._changeClass(targetDate, 'gifting', $pageTpl.extraGift);
                } else if (targetDate == curDate && signRecordArr[i].extracredit == '0') {
                    // 当天，没有额外奖励
                    $calendar._changeClass(targetDate, 'now');
                } else {
                    // 当天，有额外奖励
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
            var elGift = this.domNode.signCal.find('[data-role="gift"]');

            elGift.hover(function(e) {
                e.stopPropagation();
                var self = $(this);
                elExtra.hide();
                self.find('[data-role="extra"]').show();
            }, function(e) {
                e.stopPropagation();
                elExtra.hide();
            });
        },
        // 推广位置
        _recommendListRender: function() {
            var _this = this;
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/imgad/channel/' + _this.channel,
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    var $recommendList = new $RecommendList;
                    if (code == 0) {
                        $recommendList.getListTpl(res.data, _this.domNode.recommend.find('[data-role="list"]'));
                        $recommendList.listWidth();
                        $recommendList.scrollControl(_this.domNode.recommend.find('[data-role="list"]'), _this.domNode.recommend.find('[data-role="prebtn"]'), _this.domNode.recommend.find('[data-role="nxtbtn"]'));
                    }
                },
                error: function() {
                    return;
                }
            });
        },
        // 未登录时要进行登录，不同app采用不同方法
        _doLogin: function() {
            var isLogin = $UserInfo.uid == 0 ? false : true;
            if (!isLogin) {
                if (typeof LEPass !== 'undefined') {
                    LEPass.openLoginPage();
                }
            }
        },
        // 渲染背景图
        _renderBgImg: function() {
            var _this = this;
            var elBgImg = _this.domNode.bgImg;
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/bgimg/channel/' + _this.channel,
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    var imgBg = res.data.img3;
                    if (elBgImg.length) {
                        // 浮层背景
                        if (code == 0 && imgBg) {
                            elBgImg.css('backgroundImage', 'url(' + imgBg + ')');
                        } else {
                            elBgImg.css('backgroundImage', 'url(' + _this.objVar.imgBg + ')');
                        }
                    }

                },
                error: function() {
                    if (elBgImg.length) {
                        // 浮层背景
                        elBgImg.css('backgroundImage', 'url(' + _this.objVar.imgBg + ')');
                    }
                }
            });
        },
        _initHome: function() {
            var _this = this;

            $calendar.init();
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
            // 初始化任务
            $taskList.init();

            // 大家看推荐模块
            this._recommendListRender();
            // 二维码
            this._appQrShow();
        },
        _initDom: function() {

            // 渲染各模块模板
            nodePage.html($pageTpl.mod);

            // 各模块节点
            this.domNode = {};

            // 背景图片节点
            this.domNode.bgImg = $('#pl-imgBg');
            // 签到信息
            this.domNode.signInfo = $('#sign-info');
            // 初始化签到日历
            this.domNode.signCal = $('#pl-sign-cal');
            // 任务节点
            this.domNode.recommend = $('#pl-recommend');
            // 点击显示app二维码
            this.domNode.qrNode = $('#pl-qr');

        },
        _initVars: function() {
            this.objVar = {};
            this.objVar.lockSign = false;
            // 当前渠道
            this.channel = 0;
            // 本月连续签到天数
            this.lasted = 0;
            // 日期
            this.curDate = new Date();
            this.curYear = this.curDate.getFullYear();
            this.curMonth = this.curDate.getMonth() + 1;
            this.curDay = this.curDate.getDate();
            // 默认背景图
            this.objVar.imgBg = 'http://i1.letvimg.com/lc04_iscms/201702/24/13/33/6d170995dab946b9bda68a23a9065880.jpg';
            // 签到记录缓存
            this.objVar.cacheSignRecord = {};
            // 连续签到额外奖励缓存
            this.objVar.cacheExtra = [];
        },
        init: function() {
            var _this = this;
            // 初始化
            this._initVars();
            this._initDom();
            // 判断登录状态
            this._doLogin();
            // 背景图片渲染
            this._renderBgImg();
            // 签到信息
            this._reqSignApi(function(data) {
                // 签到成功
                _this._renderSignRes(data);
                // 初始化签到日历
                _this._initHome();
            });


        }
    };
    qiandaoObj.init();
});
