var path = require('path');
var configFile = require('../app/js/config.js');


module.exports = {
    tpl: {
        options: {
            basepath: path.resolve('/', __dirname) + '/../app/js/',
            alias: configFile.alias
        },
        files: {
            'dist/js/conf/': './app/js/conf/'
        }
    }
}
