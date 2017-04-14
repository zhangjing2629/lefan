//显示获奖名单
define('mods/mobile/newList', function(require, exports, module) {
    var $mustache = require('lib/mustache/mustache');
    // 请求域名
    var $globalVars = require('mods/global/vars');

    var NewList = {
        _scrollNode: function() {
            var li = this.listNode.children('li');
            var length = li.length;
            var li0, li1, li2;
            if (length == 0) {
                return;
            } else if (length > 3) {
                this.newList.show();
                li0 = li.eq(0).clone();
                li1 = li.eq(1).clone();
                li2 = li.eq(2).clone();
                this.listNode.append(li0).append(li1).append(li2);
            } else {
                this.newList.show();
                this.listNode.parent().height(this.listNode.children('li').eq(0).height() * length);
            }
            this.height = this.listNode.height() + 1;
            this.liHeight = this.listNode.children('li').eq(0).height();
        },
        _scrollStep: function() {
            var _this = this;

            if (this.m < this.liHeight * 3) {
                this.m++;
                this.n--;
                this.listNode.css('top', _this.n + 'px');
                if (this.n <= -(this.height - this.liHeight * 3)) {
                    this.n = 0;
                }
                setTimeout(function() {
                    _this._scrollStep();
                }, 20);
            } else {
                setTimeout(function() {
                    _this.m = 0;
                    _this._scrollStep();
                }, 2000);
            }
        },
        // 请求中奖名单接口
        _reqListApi: function(callback) {
            $.ajax({
                url: $globalVars.apiDomain + '/Task/index/hero',
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
        // 渲染中奖名单信息
        _renderList: function(res) {
            var listData = {};
            $.each(res, function(key, item) {
                item.picture = item.picture.split(',')[2].replace('https://', 'http://');
            });
            listData.res = res;
            var html = '';
            html = $mustache.render(this.newListTpl, listData);
            this.listNode.append(html);
        },
        _initDom: function() {
            // 获取光荣榜结构
            this.newList = $('#pl-new');
            // 列表节点
            this.listNode = this.newList.find('[data-role="honer_list"]');
        },
        _initVars: function() {
            this.m = 0;
            this.n = 0;
            this.newListTpl = [
                '{{#res}}',
                '<li class="clearfix"><img class="thumb" src="{{picture}}"><span class="name">{{username}}</span><span class="overed">完成{{count}}个任务</span></li>',
                '{{/res}}'
            ].join('');
        },
        init: function() {
            var _this = this;
            this._initVars();
            this._initDom();
            this._reqListApi(function(data) {
                _this._renderList(data);
                _this._scrollNode();
            });
            this._scrollStep();
        }

    };
    module.exports = NewList;

});
