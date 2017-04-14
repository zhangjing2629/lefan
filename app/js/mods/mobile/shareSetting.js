define('mods/mobile/shareSetting', function(require, exports, module) {
    var $ENV = require('comp/appEnv');
    var ENV = new $ENV;
    var shareSettingObj = {
        // 分享流程
        _setAction: function() {
            var _this = this;
            // APP 分享
            if (ENV.isLeMe()) {
                if (typeof LeMe == 'undefined') {
                    window.LeMe = {};
                }
                LeMe.appProxy = function(featureFunc, arg) {
                    var url = _this.shareData.url,
                        title = _this.shareData.title,
                        description = _this.shareData.description;
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
                    title: _this.shareData.title,
                    features: [{
                        name: "分享",
                        icon: navigator.userAgent.indexOf('LeMe/3.') > 0 ? 'http://i2.letvimg.com/lc06_lemi/201701/18/14/53/587f10e5491c5.png' : "http://bbs.le.com/static/image/touch/images/share-icon.png",
                        func: "share",
                        arg: ""
                    }]
                });
            }
        },
        // APP分享方法
        _setTopNav: function(options) {
            // options = JSON.stringify(options);
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
        _initVars: function() {
            // 定义分享data
            this.shareData = {
                url: window.location.href,
                title: '每日一签 签签有礼',
                description: '新的一天要干嘛，吃饭睡觉来签到呀～！（内含不可泄露的天机哦）'
            };
        },
        init: function() {
            this._initVars();
            this._setAction();
        }
    };
    module.exports = shareSettingObj;
});
