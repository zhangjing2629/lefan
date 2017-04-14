/**
 * @fileoverview 分享配置
 * @author liyifei@le.com
 * @date 2017/04
 */
define('mods/global/share', function(require, exports, module) {

    var $ENV = require('comp/appEnv');
    var ENV = new $ENV;

    // 分享数据
    var shareData = {
        url: location.protocol + '//' + location.hostname + '/sign/share.html',
        title: '每日一签 签签有礼',
        description: '新的一天要干嘛，吃饭睡觉来签到呀～！（内含不可泄露的天机哦）'
    };

    var shareObj = {
        // leme APP分享方法
        _setTopNav: function(options) {
            options = JSON.stringify(options);
            try {
                window.LeMeJSBridge.setTopNav(options);
            } catch (e) {
                if (window.webkit) {
                    try {
                        window.webkit.messageHandlers.setTopNav.postMessage(options);
                    } catch (e) {}
                }
            }
        },
        // leme APP分享配置
        _lemeAppShare: function() {
            if (typeof LeMe == 'undefined') {
                window.LeMe = {};
            }
            LeMe.appProxy = function(featureFunc, arg) {
                var url = shareData.url,
                    title = shareData.title,
                    description = shareData.description;
                if (featureFunc != 'share') {
                    return;
                }
                // ios
                try {
                    window.webkit.messageHandlers.showShare.postMessage({
                        url: url,
                        title: title,
                        description: description,
                        callback: 'shareCallBack'
                    });
                } catch (e) {}
                // android
                try {
                    LeMeJSBridge.showShare(url, title, description, 'shareCallBack');
                } catch (e) {
                    try {
                        LeMeJSBridge.showShare(url, title, description);
                    } catch (e) {}
                }
            };
            LeMe.appProxy.shareCallBack = function() {};
            this._setTopNav({
                title: shareData.title,
                features: [{
                    name: "分享",
                    icon: navigator.userAgent.indexOf('LeMe/3.') > 0 ? 'http://i2.letvimg.com/lc06_lemi/201701/18/14/53/587f10e5491c5.png' : "http://bbs.le.com/static/image/touch/images/share-icon.png",
                    func: "share",
                    arg: ""
                }]
            });
        },
        // TODO CODE
        // 获取微信 token
        _reqWxToken: function() {},
        // 微信分享配置
        _wxShare: function() {},
        // 入口
        init: function() {
            // leme APP 分享
            if (ENV.isLeMe()) {
                this._lemeAppShare();
            }
        }
    };

    module.exports = shareObj;

});
