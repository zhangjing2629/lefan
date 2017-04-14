//红包雨动画
define('mods/mobile/hongbaoRain', function(require, exports, module) {
    var $ENV = require('comp/appEnv');
    var ENV = new $ENV;
    // function HongbaoRain(){
    // 	this.className = 'type';
    // }
    // HongbaoRain.prototype.random = function (m, n){
    // 	return Math.floor(Math.random()*(n-m+1) + m);
    // }
    // HongbaoRain.prototype.step = function (){
    // 	var that = this;
    // 	var n = that.random(1, 48);
    //        //$('.' + that.className + '_' + n).animate({top : '300px', opacity : 0.3},800,function(){
    //           // $('.' + that.className + '_' + n).css({top : '-65px', opacity : 1});
    //        //});
    // }
    // HongbaoRain.prototype.init = function (){
    // 	$('.' + this.className).css('top', '-65px');
    // 	$('[data-role="hongbao_rain"]').addClass('ing');
    // 	console.log($(this));
    // }
    // module.exports = HongbaoRain;
    function HongbaoRain() {
        this.ani = $('[data-role="donghua"]');
    }

    HongbaoRain.prototype.rand = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // 触发
    HongbaoRain.prototype.init = function() {
        // 获取动画元素

        (function() {
            // For easy use
            var $t = $('.clipped-box');
            var amount = 8;
            // Get the width of each clipped rectangle.
            var width = $t.width() / (amount);
            var height = $t.height() / (amount);

            var y = 0,
                z;
            for (z = 0; z <= (amount * width); z = z + width) {
                $('<div class="clipped" style="clip: rect(' + y + 'px, ' + (z + width) + 'px, ' + (y + height) + 'px, ' + z + 'px)"></div>').appendTo($t);
                if (z === (amount * width) - width) {
                    y = y + height;
                    z = -width;
                }

                if (y === (amount * height)) {
                    z = 9999999;
                }
            }

        })();
        var _this = this;

        // Apply to each clipped-box div.
        _this.ani.children().each(function() {
            // So the speed is a random speed between 90m/s and 120m/s. I know that seems like a lot
            // But otherwise it seems too slow. That's due to how I handled the timeout.
            var v = _this.rand(20, 100),
                angle = _this.rand(60, 89),
                // The angle (the angle of projection) is a random number between 80 and 89 degrees.
                theta = (angle * Math.PI) / 180,
                // Theta is the angle in radians
                g = -9.8; // And gravity is -9.8. If you live on another planet feel free to change
            // $(this) as self
            var self = $(this);

            // time is initially zero, also set some random variables. It's higher than the total time for the projectile motion
            // because we want the squares to go off screen.
            var t = 1,
                z, nx, ny;
            // totalt = 12;

            // The direction can either be left (1), right (-1) or center (0). This is the horizontal direction.
            var negate = [1, -1],
                direction = negate[Math.floor(Math.random() * negate.length)];

            // 定制颜色数组
            var bgColors = ["#f14223", "#fc662a", "#ffcc33", "#f2f04d", "#baef3f", "#42f1ec", "#288ce2", "#513389"];


            // And apply those
            $(this).css({
                // 左右抖动
                // 'transform': 'scale(' + randScale + ') skew(' + randDeg + 'deg) rotateZ(' + randDeg2 + 'deg)',
                //'background' : newColor
                //修改背景色
                'background': bgColors[_this.rand(0, 7)]
            });

            // Set an interval
            var ux, uy;
            z = setInterval(function() {
                // Horizontal speed is constant (no wind resistance on the internet)
                ux = (Math.cos(theta) * v) * direction;

                // Vertical speed decreases as time increases before reaching 0 at its peak
                uy = (Math.sin(theta) * v) - ((-g) * 12);

                // The horizontal position
                if (ENV.isLeMeAndroid()) {
                    nx = (ux * 3 * t);

                    // s = ut + 0.5at^2
                    ny = (uy * t) + (0.5 * (g) * Math.pow(3 * t, 2));
                } else if (ENV.isLeMeIos()) {
                    nx = (ux * t);

                    // s = ut + 0.5at^2
                    ny = (uy * t) + (0.5 * (g) * Math.pow(t, 2));
                }


                // Apply the positions
                $(self).css({
                    'bottom': (ny) + 'px',
                    'left': (nx) + 'px'
                });

                // Increase the time by 0.05
                t = t + 0.05;
                if (t > 12) {
                    clearInterval(z);
                }

            }, 20); // Run this interval every 10ms. Changing this will change the pace of the animation
        });
        // }
    };

    module.exports = HongbaoRain;
});
