define('mods/mobile/pageLuckTpl', function(require, exports, module) {
    /* beautify ignore:start */
    /* eslint-disable indent */
    var tpl = {
        luck: [
            '<div class="Sh_hd" id="user-info">',
                '<div class="thumb">',
                    '<div class="image">',
                        '<img data-role="img" src="http://i2.letvimg.com/lc05_iscms/201612/12/14/42/17b3b60f17d54d1092c5864c346938c6.jpg">',
                    '</div>',
                '</div>',
                '<div data-role="name" class="nm">饿哦日机构</div>',
            '</div>',
            '<div class="Sh_cnt">',
                '<div class="text">',
                    '<div class="yunshi" id="astro-wrap">',

                    '</div>',
                '</div>',
            '</div>',
            '<div class="Sh_icon">',
                '<div class="Sh_ft"></div>',
                    '<div class="qr"><span><img src="http://i3.letvimg.com/lc05_iscms/201703/24/17/18/e7d2ada12c594df8947b1d52660e77c3.png"></span></div>',
                '<div class="tip">扫描二维码，获取我的每日运势，浏览更多有趣资讯！</div>',
            '</div>'
        ].join(''),
        astro: [
            '<div class="text_wrap" id="astro-info">',
                '<p>今日爱情运势</p>',
                '<p data-role="love"></p>',
                '<p>今日事业运势</p>',
                '<p data-role="career"></p>',
                '<p>今日财运</p>',
                '<p data-role="fortune"></p>',
            '</div>'
        ].join(''),
        astroEmpty: [
            '<div class="text_wrap">',
                '<p>老夫掐指一算，您还没有完善您的个人信息。快去签到页完善信息。</p>',
            '</div>'
        ].join('')
    };
    /* beautify ignore:end */
    /* esling-disable indent */
    module.exports = tpl;
});
