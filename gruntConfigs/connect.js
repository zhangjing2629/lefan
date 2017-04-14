//var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var serveStatic = require('serve-static');

var mountFolder = function(connect, dir) {
    return serveStatic(require('path').resolve(dir));
};


module.exports = {
    options: {
        port: 80,
        open: false,
        hostname: 'local.h5.bbs.le.com',
        //hostname: 'localhost',
        //livereload: 35729,
        base: './app/'
    },
    proxies: [{
        context: '/',
        // host: '10.154.156.231',
        // host: '10.154.157.145',
        host: '10.73.72.22',
        port: 80,
        https: false,
        xforward: false,
        changeOrigin: true,
        headers: {},
        hideHeaders: ['x-removed-header']
    }],

    livereload: {
        options: {
            base: {
                path: './app/',
                options: {}
            },
            debug: false,
            middleware: function(connect, options, middlewares) {

                middlewares = [

                    //lrSnippet,

                    function(req, res, next) {
                        var testJsReg = /(\/[^\/]+){5}(.*)\.js/;
                        var testCssReg = /(\/[^\/]+){6}(.*)\.css/;
                        if (testJsReg.test(req.url)) {
                            req.url = req.url.replace(/(\/[^\/]+){5}/, '/js');
                        }
                        if (testCssReg.test(req.url)) {
                            req.url = req.url.replace(/(\/[^\/]+){5}\/mobile/, '/css/mobile/');
                            req.url = req.url.replace(/(\/[^\/]+){5}\/pc/, '/css/pc/');
                            req.url = req.url.replace(/(\/[^\/]+){5}\/qiandao/, '/css/conf');
                            req.url = req.url.replace(/(\/[^\/]+){5}/, '/css');
                        }
                        next();
                    },

                    mountFolder(connect, 'app'),

                    function(req, res, next) {
                        var path = req.url;
                        if ('h5.bbs.le.com' == req.headers.host || 'test.h5.bbs.le.com' == req.headers.host) {
                            proxySnippet.apply(this, arguments);
                        } else {
                            next();
                        }
                    }
                ];

                return middlewares;
            },
            livereload: false
        }
    },
    dist: {
        options: {
            base: './dist/',
            livereload: false,
            open: false,
            middleware: function(connect, options, middlewares) {

                middlewares = [

                    function(req, res, next) {
                        var testJsReg = /(\/[^\/]+){5}(.*)\.js/;
                        var testCssReg = /(\/[^\/]+){6}(.*)\.css/;
                        if (testJsReg.test(req.url)) {
                            req.url = req.url.replace(/(\/[^\/]+){5}/, '/js');
                        }
                        if (testCssReg.test(req.url)) {
                            req.url = req.url.replace(/(\/[^\/]+){5}\/mobile/, '/css/mobile/');
                            req.url = req.url.replace(/(\/[^\/]+){5}\/pc/, '/css/pc/');
                            req.url = req.url.replace(/(\/[^\/]+){5}\/qiandao/, '/css/conf');
                            req.url = req.url.replace(/(\/[^\/]+){5}/, '/css');
                        }
                        next();
                    },
                    mountFolder(connect, 'dist'),
                    function(req, res, next) {
                        var path = req.url;
                        if ('h5.bbs.le.com' == req.headers.host || 'test.h5.bbs.le.com' == req.headers.host) {
                            proxySnippet.apply(this, arguments);
                        } else {
                            next();
                        }
                    }
                ];

                return middlewares;
            },
            livereload: false
        }
    }
}
