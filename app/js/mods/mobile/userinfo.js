// 修改个人信息
define('mods/mobile/userinfo', function(require, exports, module) {
    var $Region = require('mods/mobile/regionSetting');
    var $region = new $Region;
    var $pageTpl = require('mods/mobile/pageInfoTpl');
    var $Tools = require('mods/commonTools');
    var $tools = new $Tools;
    var pageNode = $('#page-userinfo');
    // 请求域名
    var $globalVars = require('mods/global/vars');

    if (!pageNode.length) {
        return;
    }

    var userinfoObj = {
        // 获取用户信息接口
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
        // 渲染用户信息页面
        _renderUserInfo: function(data) {
            var username = data.username;
            var uid = data.uid;
            var gender = data.gender;
            var birthday = data.birthday;
            var province = data.province;
            var city = data.city;
            // 渲染信息
            this.usernameNode.val(username);
            this.uidNode.html(uid);
            gender = parseInt(gender);
            if (gender == 0) {
                gender = 1;
            }
            $("input[name='gender'][value='" + gender + "']").attr('checked', 'checked').prev().addClass('checked');
            this.birthdayNode.val(birthday);
            var regionNode = $('#region');
            if (province && city) {
                regionNode.val(province + ' ' + city);
            }

        },
        // 选择性别
        _checkGender: function() {
            var genderLabel = this.genderNode.find('label');
            genderLabel.on('tap', function() {
                var self = $(this);
                self.find('span').addClass('checked').next().attr('checked', 'checked');
                self.siblings().find('span').removeClass('checked').next().removeAttr('checked');
            });
        },
        // 监听生日和地区内容是否为空
        _listenSubmit: function() {
            var _this = this;
            var regionInputNode = $('#region');
            setInterval(function() {
                var username = _this.usernameNode.val();
                var birthdayValue = _this.birthdayNode.val();
                var regionValue = regionInputNode.val();
                if (username && birthdayValue && regionValue) {
                    _this.submitBtn.find('a').addClass('active');
                } else {
                    _this.submitBtn.find('a').removeClass('active');
                }
            }, 500);
        },
        // 提交用户信息接口
        _submitUserInfo: function() {
            var _this = this;

            this.submitBtn.on('tap', function() {
                var self = $(this);
                if (!self.find('a').hasClass('active')) {
                    return;
                }
                if (_this.submitLock) {
                    return;
                }
                var username = _this.usernameNode.val();
                var gender = _this.genderNode.find('input[name="gender"]:checked').val();
                var birthday = _this.birthdayNode.val();
                var regionInputValue = $('#region').val();
                var province = encodeURIComponent(regionInputValue.split(' ')[0]);
                var city = encodeURIComponent(regionInputValue.split(' ')[1]);
                var regx = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
                var regxChinese = /[\u4E00-\u9FA5]/;
                var i, myLen = 0;
                for (i = 0; i < username.length; i++) {
                    // 一个中文字符等于两个英文字符
                    // 英文字符长度
                    if (regxChinese.test(username[i])) {
                        myLen += 2;
                    } else {
                        myLen++;
                    }
                }
                if (!regx.test(username)) {
                    alert('昵称不合法！');
                    return false;
                }
                if (myLen > 32 || myLen < 4) {
                    alert('昵称不合法！');
                    return false;
                }
                _this.submitLock = true;
                // 将用户名进行转义
                username = encodeURIComponent(username);
                $.ajax({
                    url: $globalVars.apiDomain + '/Task/Index/index/username/' + username + '/gender/' + gender + '/birthday/' + birthday + '/province/' + province + '/city/' + city + '/id/1',
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(res) {
                        var code = res.ret;
                        if (code == 0) {
                            window.location.href = '/sign/index.html';
                        } else if (code == 10027) {
                            alert('昵称已存在！');
                        } else {
                            alert('任务已完成！');
                            window.location.href = '/sign/index.html';
                        }
                    },
                    complete: function() {
                        _this.submitLock = false;
                    },
                    error: function() {
                        return;
                    }
                });
            });
        },
        // 填写用户生日信息
        _setBirthDate: function() {
            var _this = this;
            this.birthdayNode.mobiscroll().date({
                theme: "ios",
                mode: "scroller",
                display: "bottom",
                lang: "zh",
                startYear: 1900,
                endYear: new Date().getFullYear(),
                dateFormat: 'yyyy-mm-dd',
                onSelect: _this._birthCallback,
                cssClass: "birthSet"
            });
        },
        // 设置生日的callback
        _birthCallback: function() {
            var sendData = {
                year: $("div.dw-sel").eq(0).attr("data-val"),
                month: $tools.format0Single((Number($("div.dw-sel").eq(1).attr("data-val")) + 1)),
                day: $tools.format0Single($("div.dw-sel").eq(2).attr("data-val"))
            };
            if (sendData.year == new Date().getFullYear()) {
                if (sendData.month > new Date().getMonth() + 1 || (sendData.month == new Date().getMonth() + 1 && sendData.day > new Date().getDate())) {
                    alert("所选日期大于当前日期,请重新选择");
                    window.location.reload();
                }
            }
        },
        // 填写用户地址信息
        _setRegion: function() {
            this.regionNode.html($region.getData());
            this.regionNode.mobiscroll().treelist({
                theme: "ios",
                mode: "scroller",
                display: "bottom",
                lang: "zh",
                labels: ['Region', 'Country', 'City'],
                placeholder: "所在地",
                onSelect: '',
                cssClass: "regionSet"
            });
        },

        _initDom: function() {
            // 用户信息模版
            this.userinfoNode = $('#pl-userinfo');
            // 用户名
            this.usernameNode = this.userinfoNode.find('[data-role="username"]');
            // 用户uid
            this.uidNode = this.userinfoNode.find('[data-role="uid"]');
            // 用户性别
            // this.genderNode = this.userinfoNode.find('input[name="gender"]');
            this.genderNode = this.userinfoNode.find('[data-role="gender"]');
            // 用户生日
            this.birthdayNode = this.userinfoNode.find('[data-role="birthday"]');
            // 用户地区
            this.regionNode = this.userinfoNode.find('[data-role="region"]');
            // 提交按钮
            this.submitBtn = $('[data-role="submit"]');
        },
        _initVars: function() {
            this.submitLock = false;
        },
        init: function() {
            var _this = this;
            // 添加页面模版
            pageNode.html($pageTpl.info);
            this._initDom();
            this._initVars();
            this._setBirthDate();
            this._setRegion();
            // 请求用户信息
            this._reqUserInfoApi(function(data) {
                _this._renderUserInfo(data);
            });
            this._checkGender();
            // 提交用户信息

            this._listenSubmit();
            this._submitUserInfo();
        }
    };
    userinfoObj.init();
});
