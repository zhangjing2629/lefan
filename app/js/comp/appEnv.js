// 判断当前app是何种app
define('comp/appEnv', function(require,exports,module){
    // 通过ua来判断
    function AppEnv() {
        // ua
        this.ua = window.navigator.userAgent.toLowerCase();
    }
    AppEnv.prototype.isLeMe = function(){
        var _this = this;
        var isLemeApp = _this.ua.indexOf('leme') !== -1 ? true : false;
        return isLemeApp;
    };
    AppEnv.prototype.isLeMeIos = function(){
        var _this = this;
        var isLeMeIos = _this.ua.indexOf('ios') !== -1 ? true : false;
        return isLeMeIos;
    };
    AppEnv.prototype.isLeMeAndroid = function(){
        var _this = this;
        var isLeMeAndroid = _this.ua.indexOf('android') !== -1 ? true : false;
        return isLeMeAndroid;
    };
    AppEnv.prototype.isLetv = function(){
        var _this = this;
        var isLetvApp = _this.ua.indexOf('letvclient') !== -1 ? true : false;
        return isLetvApp;
    };
    module.exports = AppEnv;
});
