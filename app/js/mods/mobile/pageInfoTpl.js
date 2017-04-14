define('mods/mobile/pageInfoTpl', function(require, exports, module) {
    /* beautify ignore:start */
    /* eslint-disable indent */
    var tpl = {
        info: [
            // 账号信息
            '<div class="M_aced" id="pl-userinfo">',
                '<ul>',
                    '<li class="item">',
                        '<i class="ac_icon ac_icon_nm"></i>',
                        '<label>',
                        '<span class="msg" >',
                        '<input data-role="username" type="text" placeholder="昵称" class="ipt nm">',
                        '</span>',
                        '</label>',
                        '<span class="small_tip">4-32个字符，支持中英文、数字或“_”</span>',
                    '</li>',
                    '<li class="item">',
                        '<i class="ac_icon ac_icon_nb"></i>',
                        '<span class="msg" data-role="uid">',
                        '</span>',
                    '</li>',
                    '<li class="item" data-role="gender">',
                        '<i class="ac_icon ac_icon_gd"></i>',
                        '<span class="msg">',
                            '<label>男<span class="smu_radio"></span><input name="gender" type="radio" class="hide" value="1"></label>',
                            '<label>女<span class="smu_radio"></span><input name="gender" type="radio" class="hide" value="2"></label>',
                        '</span>',
                    '</li>',
                    '<li class="item">',
                        '<i class="ac_icon ac_icon_bs"></i>',
                        '<label>',
                            '<span class="msg">',
                                '<input data-role="birthday" type="text" placeholder="生日" class="ipt">',
                            '</span>',
                        '</label>',
                    '</li>',
                    '<li class="item">',
                        '<i class="ac_icon ac_icon_lc"></i>',
                        '<label>',
                            '<span class="msg">',
                                '<ul data-role="region" class="hide">',
                                '</ul>',
                            '</span>',
                        '</label>',
                    '</li>',
                '</ul>',
            '</div>',
            // 账号信息
            '<div class="M_sub" data-role="submit">',
                // 激活状态增加 active
                '<a href="javascript:;">任务完成  去领乐米</a>',
            '</div>'
        ].join('')
    };
    /* beautify ignore:end */
    /* esling-disable indent */
    module.exports = tpl;
});
