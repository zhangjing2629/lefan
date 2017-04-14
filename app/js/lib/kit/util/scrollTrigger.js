/**
 * @fileoverview 通用组件，页面滚动时触发事件。常用来发送曝光布码等
 * @authors liyifei@letv.com
 * @date 2015/12
 */

define(function (require, exports, module) {

    var $win = $(window),
        quque = [],
        timer = 0,
        bind = false;

    var onscroll = function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            ScrollTrigger._call();
        }, 100);
    };

    /*--
        页面滚动时触发事件对象
        -eg
            var ScrollTrigger = require('air.util.ScrollTrigger');
            ScrollTrigger.add({
                point: $('.Comment').offset().top-250,
                handler: initComment
            });
    */
    var ScrollTrigger = {
        calling: false, //必须增加执行中的标识，防止嵌套add出现bug
        /*--
            添加触发任务
            -p object item 触发任务，要包含以下参数：
                <p>point: 距页面顶部的高度值，滚动到这个高度的时候执行处理函数；
                    或是 一个节点选择器，滚动到这个节点的时候执行处理函数。</p>
                <p>handler: 处理函数。</p>
                <p>offsetY: 可选，如果point是一个节点选择器，
                    那么可以传一个offsetY进行修正。</p>
                <p>isOnce: 可选，是否只触发一次。默认true，只触发一次。</p>
        */
        add: function (item) {
            item.offsetY || (item.offsetY = 0);
            quque.push(item);
            this.calling || this._call(); //立即执行一次
            if (!bind) {
                //兼容移动端的scroll事件
                window.addEventListener ?
                    window.addEventListener('scroll', onscroll, false) :
                    $win.on('scroll', onscroll);
                bind = true;
            }
        },
        //私有方法，不要调用
        _call: function () {
            var i = quque.length;
            if (i===0) {
                window.removeEventListener ?
                    window.removeEventListener('scroll', onscroll) : 
                    $win.off('scroll', onscroll);
                bind = false;
                return;
            }
            this.calling = true;
            var top = $win.scrollTop() + $win.height(),
                item, offsetTop;
            while (i--) {
                item = quque[i];
                offsetTop = typeof item.point==='number' ? item.point :
                    $(item.point).offset().top + item.offsetY;
                if (top>offsetTop) {
                    item.isOnce===false || quque.splice(i, 1); //队列中移出此项
                    item.handler();
                }
            }
            this.calling = false;
        }
    };

    module.exports = ScrollTrigger;

});