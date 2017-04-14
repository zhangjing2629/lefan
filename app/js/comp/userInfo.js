define('comp/userInfo', function(require, exports, module) {
    // 用户信息
    var userInfo = {
        'uid': 0
    };
    // 判断登录状态，登录信息
    if (typeof LEPass !== 'undefined') {
        try {
            LEPass.onReady(function(res) {
                var isLogin = res.islogin;
                if (isLogin == 1) {
                    userInfo = res.userinfo;
                }
            }, {
                plat: 'bbs',
                language: 'zh-CN',
                region: 'CN'
            });
        } catch (e) {
            return;
        }
    }

    // test code
    // userInfo.ssouid = 205465949;

    return userInfo;
});
