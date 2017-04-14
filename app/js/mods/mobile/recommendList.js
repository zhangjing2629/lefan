// 推广位
define('mods/mobile/recommendList', function(require, exports, module) {
    var $mustache = require('lib/mustache/mustache');
    var $ENV = require('comp/appEnv');
    var ENV = new $ENV;
    // 请求域名
    var $globalVars = require('mods/global/vars');
    var RecommendListObj = {
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
        // 计算容器宽度
        _listWidth: function() {
            var listPl = this.listNode.find('li');
            var widthLi = parseInt(listPl.width());
            var length = listPl.length;
            var widthMarginRight = parseInt(listPl.css('margin-right').replace('px', ''));
            var width = (widthLi + widthMarginRight) * length;
            this.listNode.width(width);
        },
        // 渲染模版
        _renderList: function(res) {
            var _this = this;
            _this.parent = parent;
            var listData = {};
            listData.res = res;
            var html = '';
            html = $mustache.render(this.recommendTpl, listData);
            _this.listNode.append(html);
            // _this.listWidth();
        },
        // 请求接口
        _reqListApi: function(callback) {
            var _this = this;
            $.ajax({
                url: $globalVars.apiDomain + '/Sign/Index/imgad/channel/' + _this.channel,
                type: 'GET',
                dataType: 'jsonp',
                success: function(res) {
                    var code = res.ret;
                    var data = res.data;
                    if (code == 0) {
                        if (callback) {
                            callback(data);
                        }
                    }
                },
                error: function() {
                    return;
                }
            });
        },
        _initVars: function() {
            this.recommendTpl = [
                '{{#res}}',
                '<li><a href="{{url}}"><img src="{{img}}" title="{{title}}"></a></li>',
                '{{/res}}'
            ].join('');
            this.channel = 0;
        },
        _initDom: function() {
            this.recommend = $('#pl-recommend');
            // list节点
            this.listNode = this.recommend.find('[data-role="list"]');
        },
        init: function() {
            var _this = this;
            this._initVars();
            this._initDom();
            this._reqListApi(function(data) {
                _this._renderList(data);
                _this._listWidth();
            });
        }
    };

    module.exports = RecommendListObj;
});
