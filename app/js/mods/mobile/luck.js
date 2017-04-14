// 运势js
define('mods/mobile/luck', function(require, exports, module) {
    // 用户信息
    var $Tools = require('mods/commonTools');
    var $tools = new $Tools;
    // 页面模板
    var $pageTpl = require('mods/mobile/pageLuckTpl');
    // 请求域名
    var $globalVars = require('mods/global/vars');

    var nodePage = $('#page-luck');
    if (!nodePage.length) {
        return;
    }

    var luckObj = {
        // 请求运势接口
        _reqAstroApi: function() {
            var _this = this;
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/astro/uid/' + this.uid,
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    var data = res.data;
                    var loveNode, careerNode, fortuneNode;
                    if (code == 0) {
                        if (data && !$.isArray(data)) {
                            _this.domNode.astroWrap.html($pageTpl.astro);
                            loveNode = _this.domNode.astroWrap.find('[data-role="love"]');
                            careerNode = _this.domNode.astroWrap.find('[data-role="career"]');
                            fortuneNode = _this.domNode.astroWrap.find('[data-role="fortune"]');
                            loveNode.html(data.love);
                            careerNode.html(data.career);
                            fortuneNode.html(data.fortune);
                        } else {
                            _this.domNode.astroWrap.html($pageTpl.astroEmpty);
                        }
                    } else {
                        alert('哇哦！页面迷路找不到了，请稍后再试吧！');
                    }
                },
                error: function() {
                    alert('哇哦！页面迷路找不到了，请稍后再试吧！');
                }
            });
        },
        // 显示用户信息
        _renderUserInfo: function() {
            var elImgNode = this.domNode.userInfo.find('[data-role="img"]');
            var elNameNode = this.domNode.userInfo.find('[data-role="name"]');
            elImgNode.attr('src', this.avatar);
            elNameNode.html(this.nickname);
        },
        _initDom: function() {
            // 渲染各模块模板
            nodePage.html($pageTpl.luck);
            // 各模块节点
            this.domNode = {};
            // 获取用户信息节点
            this.domNode.userInfo = $('#user-info');
            // 获取运势容器
            this.domNode.astroWrap = $('#astro-wrap');

        },
        _initVars: function() {
            this.uid = $tools.getUrlParam('uid');
            this.avatar = $tools.getUrlParam('avatar');
            this.nickname = encodeURI($tools.getUrlParam('nickname'));
            this.nickname = decodeURI(decodeURI(this.nickname));
        },
        init: function() {
            this._initVars();
            this._initDom();
            // 获取信息运势
            this._renderUserInfo();
            this._reqAstroApi();
        }
    };
    luckObj.init();
});
