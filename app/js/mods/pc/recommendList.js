// 推广位
define('mods/pc/recommendList', function(require, exports, module) {
    var $mustache = require('lib/mustache/mustache');
    // list模版
    var recommendTpl = [
        '{{#res}}',
        '<li><a href="{{url}}" title="{{title}}" target="_blank"><img src="{{img}}"></a></li>',
        '{{/res}}'
    ].join('');

    function RecommendListObj() {
        this.parent = '';
    };

    // 渲染模版
    RecommendListObj.prototype.getListTpl = function(res, parent) {
        var _this = this;
        _this.parent = parent;
        var listData = {};
        listData.res = res;
        var html = '';
        html = $mustache.render(recommendTpl, listData);
        parent.append(html);
    };

    // 计算容器宽度
    RecommendListObj.prototype.listWidth = function() {
        var _this = this;
        var widthLi = parseInt(_this.parent.find('li').width());
        var length = _this.parent.find('li').length;
        var widthMarginRight = parseInt(_this.parent.find('li').css('margin-right').replace('px', ''));
        var width = (widthLi + widthMarginRight) * length;
        _this.parent.width(width);
    };
    // 事件绑定
    RecommendListObj.prototype.scrollControl = function(recList, prebtn, nxtbtn) {
        var num = recList.find('li').length;
        var liWidth = recList.find('li').width();
        liWidth = parseInt(liWidth);
        var left = 0;
        var i = 0;
        // 如果小于，隐藏按钮
        if (num > 3) {
            prebtn.show();
        }

        prebtn.on("click", function() {
            if (recList.is(":animated")) {
                return;
            }
            i++;
            if (i > 0) {
                nxtbtn.show();
            }
            if (num - i < 4) {
                prebtn.hide();
            }
            left = i * (-liWidth);
            recList.animate({
                "left": left
            });
        });

        nxtbtn.on("click", function() {
            if (recList.is(":animated")) {
                return;
            }
            i--;
            prebtn.show();
            if (num - i < 4) {
                nxtbtn.hide();
            }
            if (i == 0) {
                // prebtn.show();
                nxtbtn.hide();
            }
            left = i * -liWidth;
            recList.animate({
                "left": left
            });
        });

    };


    module.exports = RecommendListObj;
});
